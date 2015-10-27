{
  'includes':[
    '/usr/include/webapi-plugins/src/common/common.gypi',
  ],
  'targets': [
    {
      'target_name': 'tizen_cordova_globalization',
      'type': 'loadable_module',
      'sources': [
        'cordova_globalization_api.js',
        'cordova_globalization_extension.cc',
        'cordova_globalization_extension.h',
        'cordova_globalization_instance.cc',
        'cordova_globalization_instance.h',
        'cordova_globalization_tools.cc',
        'cordova_globalization_tools.h',
      ],
      'include_dirs': [
        '../',
        '<(SHARED_INTERMEDIATE_DIR)',
      ],
      'variables': {
        'packages': [
          'webapi-plugins',
          'icu-i18n',
          'vconf'
        ],
      },
    },
  ],
}