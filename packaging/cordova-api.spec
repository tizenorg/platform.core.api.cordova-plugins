%define _manifestdir %{TZ_SYS_RW_PACKAGES}
%define _desktop_icondir %{TZ_SYS_SHARE}/icons/default/small

%define crosswalk_extensions tizen-extensions-crosswalk
%define webapi_tools /usr/include/webapi-plugins/tools

Name:       cordova-api
Version:    0.1
Release:    0
License:    Apache-2.0 and BSD-2.0 and MIT
Group:      Development/Libraries
Summary:    Cordova API using Tizen plugins
Source0:    %{name}-%{version}.tar.gz

BuildRequires: ninja
BuildRequires: pkgconfig(webapi-plugins)

%description
Cordova API using Tizen plugins.

%prep
%setup -q

%build

export GYP_GENERATORS='ninja'
GYP_OPTIONS="--depth=. -Dtizen=1 -Dextension_build_type=Debug -Dextension_host_os=%{tizen_profile_name}"
GYP_OPTIONS="$GYP_OPTIONS -Ddisplay_type=x11"

%{webapi_tools}/gyp/gyp $GYP_OPTIONS src/cordova-api.gyp

ninja -C out/Default %{?_smp_mflags}

%install
mkdir -p %{buildroot}/usr/share/license
cp LICENSE %{buildroot}/usr/share/license/%{name}
cat LICENSE.BSD-2.0 >> %{buildroot}/usr/share/license/%{name}

# Extensions.
mkdir -p %{buildroot}%{_libdir}/%{crosswalk_extensions}
install -p -m 644 out/Default/libtizen*.so %{buildroot}%{_libdir}/%{crosswalk_extensions}

# execute desc_gentool
LD_LIBRARY_PATH=$LD_LIBRARY_PATH:%{buildroot}%{_libdir}/%{crosswalk_extensions} %{webapi_tools}/desc_gentool %{buildroot}%{_libdir}/%{crosswalk_extensions} > cordova-api.json

# temporary plugins description for lazy loading
install -p -m 644 cordova-api.json %{buildroot}%{_libdir}/%{crosswalk_extensions}/cordova-api.json

%files
%{_libdir}/%{crosswalk_extensions}/libtizen*.so
%{_libdir}/%{crosswalk_extensions}/cordova-api.json
%{_datadir}/license/%{name}
%manifest cordova-api.manifest
