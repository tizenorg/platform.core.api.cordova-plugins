{
  'includes':[
    '/usr/include/webapi-plugins/src/common/common.gypi',
  ],
  'targets': [
    {
      'target_name': 'tizen_cordova',
      'type': 'loadable_module',
      'sources': [
        'cordova_api.js',
        'cordova_extension.cc',
        'cordova_extension.h',
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
