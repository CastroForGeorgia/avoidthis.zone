import os
import json
import logging
from pathlib import Path
from openai import APIStatusError, OpenAI, APIConnectionError, RateLimitError

# Set up logging
logger = logging.getLogger(__name__)
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.DEBUG)
console_formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
console_handler.setFormatter(console_formatter)
logger.addHandler(console_handler)
logger.setLevel(logging.DEBUG)

# Environment setup
API_KEY = os.environ.get("OPENAI_API_KEY")
if not API_KEY:
    logger.critical("OPENAI_API_KEY environment variable not set.")
    exit("Error: OPENAI_API_KEY environment variable not set.")

client = OpenAI(api_key=API_KEY)

# Constants
TRANSLATIONS_DIR = Path("./src/i18n/translations")
CACHE_FILE = Path("./scripts/translation_cache.json")
LANGUAGES = ["es", "vi", "ko", "zh"]  # Target languages


def load_translation_cache():
    """Load the translation cache from a JSON file."""
    if CACHE_FILE.exists():
        try:
            with CACHE_FILE.open("r", encoding="utf-8") as f:
                return json.load(f)
        except json.JSONDecodeError as e:
            logger.error(f"Error decoding JSON cache: {e}")
            return {}
    return {}


def save_translation_cache(cache):
    """Save the translation cache to a JSON file."""
    try:
        with CACHE_FILE.open("w", encoding="utf-8") as f:
            json.dump(cache, f, ensure_ascii=False, indent=4)
        logger.info("Cache saved successfully.")
    except Exception as e:
        logger.error(f"Error saving cache: {e}")


def translate_text(
    text,
    source_lang="en-US",
    target_lang="es-MX",
    model="gpt-4o-mini",
    max_output_tokens=16384,
):
    """
    Translate text using OpenAI's API with cultural nuance considerations.

    Parameters:
    - text (str): The text to translate.
    - source_lang (str): Source language (default: English).
    - target_lang (str): Target language (default: Spanish).
    - model (str): The OpenAI model to use (default: gpt-4o-mini).
    - max_output_tokens (int): Maximum output tokens for the model (default: 16384 for GPT-4o-mini).

    Returns:
    - str: Translated text or None if translation fails.
    """
    logger.debug(
        f"Preparing nuanced translation request using model {model} with max_output_tokens={max_output_tokens}."
    )
    system_prompt = f"""
    Translate complex scenarios with cultural nuances and idiomatic expressions from {source_lang} to {target_lang}.

    # Guidelines

    - Ensure cultural context and local idioms are preserved.
    - Maintain the original text's intent and tone.
    - Adapt expressions that don't directly translate.
    - Don't translate urls or any text that could break a link
    - Do NOT adjust variable names within Liquid Code.
    # Steps

    1. Analyze the provided text for idiomatic expressions or cultural references.
    2. Determine if direct translation affects meaning or tone.
    3. Adjust the translation to maintain intent, considering cultural context.

    # Output Format

    Provide the translated text in typescript format.

    # Notes

    - For expressions without direct translations, opt for cultural equivalence rather than literal translation.
    - Be cautious of false friends—similar words with different meanings in both languages.
    """
    prompt = f"Translate the following text:\n\n{text}"

    # Calculate token availability dynamically
    total_tokens = len(system_prompt.split()) + len(prompt.split())
    if total_tokens > 128000:
        logger.error("Input exceeds GPT-4o-mini's context limit of 128,000 tokens.")
        return None

    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt},
            ],
            max_tokens=max_output_tokens,
            temperature=0.3,
        )
        translated_text = response.choices[0].message.content.strip()
        logger.info("Translation with cultural nuance successful.")
        return translated_text
    except RateLimitError:
        logger.error("Rate limit exceeded during translation.")
        return None
    except APIConnectionError:
        logger.error("Failed to connect to OpenAI API.")
        return None
    except APIStatusError as e:
        logger.error(f"OpenAI API error: {e.status_code} - {e.message}")
        return None
    except Exception as e:
        logger.exception("Unexpected error during translation.")
        return None


def translate_file(source_path, target_lang, cache):
    """Translate a single TypeScript file."""
    with source_path.open("r", encoding="utf-8") as f:
        content = f.read()

    file_hash = hash(content)
    cache_key = f"{source_path}_{target_lang}"
    if cache.get(cache_key) == file_hash:
        logger.info(f"File already up-to-date: {source_path.name} for {target_lang}")
        return

    logger.info(f"Translating {source_path.name} to {target_lang}")
    translated_content = translate_text(content, target_lang=target_lang)

    if not translated_content:
        logger.error(f"Failed to translate {source_path.name} to {target_lang}")
        return

    # Write the translated content
    target_file = source_path.with_name(f"{target_lang}.ts")
    try:
        with target_file.open("w", encoding="utf-8") as f:
            f.write(translated_content)
        logger.info(f"Translated file saved: {target_file}")
        cache[cache_key] = file_hash
    except Exception as e:
        logger.error(f"Error saving translated file {target_file}: {e}")


def main():
    """Main translation script."""
    logger.info("Starting translation script.")
    cache = load_translation_cache()

    en_file = TRANSLATIONS_DIR / "en.ts"
    if not en_file.exists():
        logger.error(f"English base file not found: {en_file}")
        return

    for lang in LANGUAGES:
        translate_file(en_file, lang, cache)

    save_translation_cache(cache)
    logger.info("Translation completed successfully.")


if __name__ == "__main__":
    main()
