{
  'includes':[
    '/usr/include/webapi-plugins/src/common/common.gypi',
  ],

  'targets': [
    {
      'target_name': 'cordova-api',
      'type': 'none',
      'dependencies': [
        'file/cordova_file.gyp:*',
        'globalization/cordova_globalization.gyp:*',
      ],
    },
  ], # end targets
}
