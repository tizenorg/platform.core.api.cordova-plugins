{
  'includes':[
    '/usr/include/webapi-plugins/src/common/common.gypi',
  ],
  'targets': [
    {
      'target_name': 'tizen_cordova_filetransfer',
      'type': 'loadable_module',
      'sources': [
        'cordova_filetransfer_api.js',
        'cordova_filetransfer_extension.cc',
        'cordova_filetransfer_extension.h',
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
