`import Ember from 'ember'`
`import ENUMS from 'irene/enums';`
`import ENV from 'irene/config/environment';`
`import deviceSelection from 'irene/utils/device-selection'`

ProjectPreferencesComponent = Ember.Component.extend

  project: null
  versions: ["Loading..."]
  currentDevice: ["Loading..."]
  availableDevices: ["Loading..."]
  availableVersions: ["Loading..."]
  devices: ENUMS.DEVICE_TYPE.CHOICES[0...-1]

  didInsertElement: ->
    @send('deviceChanged')

  actions:
    deviceChanged: (value) ->
      that = @
      that.set "currentDevice", parseInt value
      platform = @get "project.platform"
      currentDevice = @get "currentDevice"
      @get("ajax").request ENV.endpoints.devices
      .then (data) ->
        versions = that.set "versions", data
        deviceType = ENUMS.DEVICE_TYPE
        platformType = ENUMS.PLATFORM
        availableVersions = that.set "availableVersions", deviceSelection(deviceType,versions,currentDevice,platformType,platform)
        if Ember.isEmpty availableVersions
          availableDevices = that.set "availableDevices", [{ "platform_version": "No Device Found" }]
        else
          availableDevices = that.set "availableDevices", availableVersions.uniqBy("platform_version", true)
      .catch (error) ->
        that.get("notify").error "failed"
        if Ember.isEmpty error?.errors
          return
        for error in error.errors
          that.get("notify").error error.detail?.message

    versionSelected: ->
      deviceChoosen = @$('#device').val()
      versionChoosen = @$('#version').val()
      projectId = @get "project.id"
      devicePreferences = [ENV.endpoints.devicePreferences, projectId].join '/'
      that = @
      data =
        deviceChoosen: deviceChoosen
        versionChoosen: versionChoosen
      @get("ajax").post devicePreferences, data: data
      .then (data) ->
        that.get("notify").success "You have sucessfully selected the device"
      .catch (error) ->
        that.get("notify").error "failed"
        if Ember.isEmpty error?.errors
          return
        for error in error.errors
          that.get("notify").error error.detail?.message

`export default ProjectPreferencesComponent`
