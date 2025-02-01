export default {
    translation: {
        Index: {
            applicationLoadErrorMessage: 'Error al cargar la aplicación',
            applicationLoadErrorDescription:
                'No se pudo cargar correctamente la aplicación con el ID {{applicationId}}. ' +
                "Estás viendo la configuración predeterminada de la aplicación.",
            errorMessage: 'Error al cargar la aplicación',
            errorDescription:
                'Ocurrió un error inesperado al cargar la aplicación. Por favor, intenta recargar la página.',
            reloadButton: 'Recargar aplicación',
        },
        BasicNominatimSearch: {
            placeholder: 'Nombre del lugar, nombre de la calle, nombre del distrito, punto de interés, etc.',
            noResultsMessage: 'No se encontraron resultados. Intenta refinar tu búsqueda.',
        },
        SideDrawer: {
            title: 'Filtros',
            languageSwitcher: {
                label: "Seleccionar idioma"
            },
            clearAllButton: 'Limpiar todos los filtros',
            applyButton: 'Aplicar filtros',
        },
        ToggleDrawerButton: {
            tooltip: 'Mostrar/ocultar filtros',
        },
        ReportModal: {
            title: 'Enviar un reporte',
            loadingMessage: 'Cargando...',
            successMessage: '¡Tu reporte ha sido enviado exitosamente!',
            errorMessage: 'No se pudo enviar el reporte. Por favor, intenta nuevamente.',
            cancelButton: 'Cancelar',
            submitButton: 'Enviar',
            resetButton: 'Restablecer',
            formErrors: {
                requiredField: 'Este campo es obligatorio.',
                invalidDate: "Esta fecha no es válida.",
                invalidUrl: "Por favor, ingresa una URL válida."
            },
            labels: {
                tactics: 'Tácticas',
                filters: "Detalles",
                raidLocationCategory: 'Categoría de ubicación de la redada',
                detailLocation: 'Ubicación detallada',
                wasSuccessful: '¿Alguien fue detenido?',
                locationReference: 'Referencia de ubicación',
                sourceOfInfo: 'Fuente de información',
                dateOfRaid: '(Opcional) Fecha',
                sourceOfInfoUrl: "URL de la fuente",
                sourceOfInfoUrlPlaceholder: "Ingresa la URL de la fuente (si aplica)"
            },
        },
        Enums: {
            ALLOWED_TACTICS: {
                SURVEILLANCE: 'Vigilancia',
                WARRANTLESS_ENTRY: 'Entrada sin orden',
                RUSE: 'Engaño',
                COLLATERAL_ARREST: 'Arresto colateral',
                USE_OF_FORCE: 'Uso de la fuerza',
                CHECKPOINT: 'Punto de control',
                KNOCK_AND_TALK: 'Tocar y hablar',
                ID_CHECK: 'Revisión de identificación',
            },
            ALLOWED_RAID_LOCATION_CATEGORY: {
                HOME: 'Hogar',
                PUBLIC: 'Público',
                WORK: 'Trabajo',
                COURT: 'Tribunal',
                HOSPITAL: 'Hospital',
                BORDER: 'Frontera',
                OTHER: 'Otro',
            },
            ALLOWED_DETAIL_LOCATION: {
                STREET: 'Calle',
                CAR_STOP: 'Parada de auto',
                SHELTER: 'Refugio',
                PROBATION: 'Oficina de libertad condicional',
                PAROLE: 'Oficina de libertad bajo palabra',
                WORKPLACE: 'Lugar de trabajo',
                HOSPITAL_WARD: 'Sala del hospital',
                IMMIGRATION_CENTER: 'Centro de inmigración',
                BUS_TERMINAL: 'Terminal de autobuses',
                TRAIN_STATION: 'Estación de tren',
                AIRPORT: 'Aeropuerto',
                OTHER_FACILITY: 'Otra instalación',
                SCHOOL: "Escuela"
            },
            ALLOWED_WAS_SUCCESSFUL: {
                YES: 'Sí',
                NO: 'No',
                UNKNOWN: 'Desconocido',
            },
            ALLOWED_LOCATION_REFERENCE: {
                INTERSECTION: 'Intersección',
                BUS_STOP: 'Parada de autobús',
                TRAIN_STATION: 'Estación de tren',
                ZIP_CODE: 'Código postal',
                LANDMARK: 'Punto de referencia',
                NONE: 'Ninguno',
            },
            ALLOWED_SOURCE_OF_INFO: {
                NEWS_ARTICLE: 'Artículo de noticias',
                PERSONAL_OBSERVATION: 'Observación personal',
                COMMUNITY_REPORT: 'Reporte comunitario',
                PUBLIC_RECORD: 'Registro público',
                LEGAL_AID_ORG: "Organización"
            },
        },
        Common: {
            loadingMessage: 'Cargando, por favor espera...',
            errorOccurred: 'Ocurrió un error. Por favor, intenta nuevamente más tarde.',
            backButton: 'Atrás',
            nextButton: 'Siguiente',
            resetButton: 'Restablecer',
            closeButton: 'Cerrar',
            searchPlaceholder: 'Buscar...',
            confirmButton: 'Confirmar',
            cancelButton: 'Cancelar',
            unknown: "Desconocido",
            createdAt: "Creado el",
            viewOnMap: "Ver en el mapa",
            navigate: "Ver en el mapa",
            filter: "Filtrar",
        },
    },
};