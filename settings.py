DEBUG = True
TEMPLATE_DEBUG = SERVE_STATIC_FILES = DEBUG

PROJECT_NAME = "Bison Vert Client"
WITH_TITLE_HEADER = True

#rights
ADMINS = ()
MANAGERS = ADMINS

#Database
DATABASE_ENGINE = 'sqlite3'
DATABASE_NAME = 'bvclient.sql'

#
TIME_ZONE = 'Europe/Paris'
LANGUAGE_CODE = 'fr'
SITE_ID = 1
USE_I18N = True

import os.path
PROJECT_ROOT_PATH = os.path.dirname(os.path.abspath(__file__))
MEDIA_ROOT = os.path.join(PROJECT_ROOT_PATH, 'staticfiles')
MEDIA_URL = '/site_media/'
 
TEMPLATE_DIRS = (
    os.path.join(PROJECT_ROOT_PATH, 'templates'),
)

STATIC_DOC_ROOT = os.path.join(PROJECT_ROOT_PATH, 'staticfiles')

ADMIN_MEDIA_PREFIX = '/media/'

SECRET_KEY = 'nppo6u@=%eeb-=7owurguf=d4)38zbqmdkjdmmvr4kwb5!6!msm'

TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.load_template_source',
    'django.template.loaders.app_directories.load_template_source',
#     'django.template.loaders.eggs.load_template_source',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'bvlibclient.ext.dj.AuthenticationMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.core.context_processors.auth',
    'django.core.context_processors.debug',
    'django.core.context_processors.i18n',
    'django.core.context_processors.media',
    'utils.context_processors.js_ext',
#    'utils.context_processors.project_info',
#    'utils.context_processors.get_google_analytics_info',
#    'utils.context_processors.get_google_adsense_info',
)

ROOT_URLCONF = 'bvclient.urls'

JS_EXT = '-min.js' if not DEBUG else '.js'

INSTALLED_APPS = (
    'django.contrib.admin', 
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'trips',
    'oauthclient',
    'utils',
)

PERSISTENT_SESSION_KEY = 'testtesttest'
SESSION_COOKIE_NAME = 'bvclient'

# OAUTH URLs
BVCLIENT_OAUTH_APPID = 'bisonvert'

# Map settings
DEFAULT_MAP_CENTER_NAME = "France" 
DEFAULT_MAP_CENTER_POINT = "POINT( 2.213749 46.227638 )" 
DEFAULT_MAP_CENTER_ZOOM = 5 

try:
    from local_settings import *
except ImportError:
    pass
