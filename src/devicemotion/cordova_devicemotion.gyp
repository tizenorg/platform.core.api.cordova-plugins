{
  'includes':[
    '/usr/include/webapi-plugins/src/common/common.gypi',
  ],
  'targets': [
    {
      'target_name': 'tizen_cordova_devicemotion',
      'type': 'loadable_module',
      'sources': [
        'cordova_devicemotion_api.js',
        'cordova_devicemotion_extension.cc',
        'cordova_devicemotion_extension.h',
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
