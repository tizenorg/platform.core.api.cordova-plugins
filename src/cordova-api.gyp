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
        'dialog/cordova_dialog.gyp:*',
        'events/cordova_events.gyp:*',
        'file/cordova_file.gyp:*',
        'globalization/cordova_globalization.gyp:*',
        'networkinformation/cordova_networkinformation.gyp:*',
        'filetransfer/cordova_filetransfer.gyp:*',
        'media/cordova_media.gyp:*',
      ],
    },
  ], # end targets
}
