export default {
    translation: {
        Index: {
            applicationLoadErrorMessage: 'Error al cargar la aplicación',
            applicationLoadErrorDescription:
                'La aplicación con ID {{applicationId}} no se pudo cargar correctamente. ' +
                'Estás viendo la configuración predeterminada de la aplicación.',
            errorMessage: 'Error al cargar la aplicación',
            errorDescription:
                'Ocurrió un error inesperado al cargar la aplicación. Por favor, intenta recargar la página.',
            reloadButton: 'Recargar Aplicación',
        },
        BasicNominatimSearch: {
            placeholder: 'Nombre del lugar, nombre de la calle, nombre del distrito, POI, etc.',
            noResultsMessage: 'No se encontraron resultados. Intenta refinar tu búsqueda.',
        },
        SideDrawer: {
            title: 'Filtros',
            languageSwitcher: {
                label: 'Seleccionar Idioma'
            },
            clearAllButton: 'Limpiar Todos los Filtros',
            applyButton: 'Aplicar Filtros',
        },
        ToggleDrawerButton: {
            tooltip: 'Mostrar/ocultar Filtros',
        },
        ReportModal: {
            title: 'Enviar un Informe',
            loadingMessage: 'Cargando...',
            successMessage: '¡Tu informe ha sido enviado con éxito!',
            errorMessage: 'No se pudo enviar el informe. Por favor, intenta de nuevo.',
            cancelButton: 'Cancelar',
            submitButton: 'Enviar',
            resetButton: 'Restablecer',
            formErrors: {
                requiredField: 'Este campo es obligatorio.',
            },
            labels: {
                tactics: 'Tácticas',
                raidLocationCategory: 'Categoría de Ubicación de Incursión',
                detailLocation: 'Ubicación Detallada',
                wasSuccessful: '¿Fue exitosa la operación?',
                locationReference: 'Referencia de Ubicación',
                sourceOfInfo: 'Fuente de Información',
            },
        },
        Enums: {
            ALLOWED_TACTICS: {
                SURVEILLANCE: 'Vigilancia',
                WARRANTLESS_ENTRY: 'Entrada Sin Orden',
                RUSE: 'Engaño',
                COLLATERAL_ARREST: 'Arresto Colateral',
                USE_OF_FORCE: 'Uso de Fuerza',
                CHECKPOINT: 'Punto de Control',
                KNOCK_AND_TALK: 'Llamar y Hablar',
                ID_CHECK: 'Verificación de Identidad',
            },
            ALLOWED_RAID_LOCATION_CATEGORY: {
                HOME: 'Hogar',
                PUBLIC: 'Público',
                WORK: 'Trabajo',
                COURT: 'Corte',
                HOSPITAL: 'Hospital',
                BORDER: 'Frontera',
                OTHER: 'Otro',
            },
            ALLOWED_DETAIL_LOCATION: {
                STREET: 'Calle',
                CAR_STOP: 'Detención de Vehículo',
                SHELTER: 'Refugio',
                PROBATION: 'Oficina de Libertad Condicional',
                PAROLE: 'Oficina de Libertad Vigilada',
                WORKPLACE: 'Lugar de Trabajo',
                HOSPITAL_WARD: 'Sala de Hospital',
                IMMIGRATION_CENTER: 'Centro de Inmigración',
                BUS_TERMINAL: 'Terminal de Autobuses',
                TRAIN_STATION: 'Estación de Tren',
                AIRPORT: 'Aeropuerto',
                OTHER_FACILITY: 'Otra Instalación',
            },
            ALLOWED_WAS_SUCCESSFUL: {
                YES: 'Sí',
                NO: 'No',
                UNKNOWN: 'Desconocido',
            },
            ALLOWED_LOCATION_REFERENCE: {
                INTERSECTION: 'Intersección',
                BUS_STOP: 'Parada de Autobús',
                TRAIN_STATION: 'Estación de Tren',
                ZIP_CODE: 'Código Postal',
                LANDMARK: 'Punto de Referencia',
                NONE: 'Ninguno',
            },
            ALLOWED_SOURCE_OF_INFO: {
                NEWS_ARTICLE: 'Artículo de Noticias',
                PERSONAL_OBSERVATION: 'Observación Personal',
                COMMUNITY_REPORT: 'Informe Comunitario',
                PUBLIC_RECORD: 'Registro Público',
            },
        },
        Common: {
            loadingMessage: 'Cargando, por favor espera...',
            errorOccurred: 'Ocurrió un error. Por favor, intenta de nuevo más tarde.',
            backButton: 'Atrás',
            nextButton: 'Siguiente',
            resetButton: 'Restablecer',
            closeButton: 'Cerrar',
            searchPlaceholder: 'Buscar...',
            confirmButton: 'Confirmar',
            cancelButton: 'Cancelar',
        },
    },
};