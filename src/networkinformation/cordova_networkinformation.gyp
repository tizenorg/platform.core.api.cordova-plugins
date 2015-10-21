{
  'includes':[
    '/usr/include/webapi-plugins/src/common/common.gypi',
  ],
  'targets': [
    {
      'target_name': 'tizen_cordova_networkinformation',
      'type': 'loadable_module',
      'sources': [
        'cordova_networkinformation_api.js',
        'cordova_networkinformation_extension.cc',
        'cordova_networkinformation_extension.h',
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
