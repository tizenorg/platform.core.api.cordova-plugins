{
  'includes':[
    '/usr/include/webapi-plugins/src/common/common.gypi',
  ],
  'targets': [
    {
      'target_name': 'tizen_cordova_device',
      'type': 'loadable_module',
      'sources': [
        'cordova_device_api.js',
        'cordova_device_extension.cc',
        'cordova_device_extension.h',
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
