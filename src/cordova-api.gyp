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
        'device/cordova_device.gyp:*',
        'file/cordova_file.gyp:*',
        'networkinformation/cordova_networkinformation.gyp:*',
      ],
    },
  ], # end targets
}
