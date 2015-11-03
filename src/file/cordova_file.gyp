{
  'includes':[
    '/usr/include/webapi-plugins/src/common/common.gypi',
  ],
  'targets': [
    {
      'target_name': 'tizen_cordova_file',
      'type': 'loadable_module',
      'sources': [
        'cordova_file_api.js',
        'cordova_file_extension.cc',
        'cordova_file_extension.h',
        'cordova_file_instance.cc',
        'cordova_file_instance.h',
      ],
      'include_dirs': [
        '../',
        '<(SHARED_INTERMEDIATE_DIR)',
      ],
      'variables': {
        'packages': [
          'webapi-plugins',
        ],
      },
    },
  ],
}
