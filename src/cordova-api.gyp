{
  'includes':[
    '/usr/include/webapi-plugins/src/common/common.gypi',
  ],

  'targets': [
    {
      'target_name': 'cordova-api',
      'type': 'none',
      'dependencies': [
        'cordova/cordova.gyp:*',
        'file/cordova_file.gyp:*',
        'globalization/cordova_globalization.gyp:*',
        'networkinformation/cordova_networkinformation.gyp:*',
        'media/cordova_media.gyp:*',
      ],
    },
  ], # end targets
}
