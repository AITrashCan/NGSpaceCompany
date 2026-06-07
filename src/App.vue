<template>

    <div v-if="!loaded" id="loadScreen">
        <div class="row row-cols-1 g-2 justify-content-center">
            <div class="col text-center"><h1 style="color:#d4a84c;font-family:'Inter',sans-serif;letter-spacing:.15em">天道长生录</h1></div>
            <div class="col text-center"><span class="icon-emoji load">☯️</span></div>
            <div class="col text-center"><h5 class="text-normal">灵气聚敛中...</h5></div>
        </div>
    </div>

    <div v-if="loaded" id="gameScreen">
        <div id="sidebar" :class="{ 'open':sidebarOpen }" role="navigation">
            <top-header>
            
                <div class="col-auto">
                    <span class="icon-emoji logo">☯️</span>
                </div>

                <div class="col text-truncate px-0">
                    <span class="h5 text-light mb-0">{{ companyName }}</span>
                </div>

                <div class="col-auto d-lg-none">
                    <button @click="sidebarOpen = false;">
                        <i class="fas fa-fw fa-times"></i>
                    </button>
                </div>
                
            </top-header>
            <inner-content data-simplebar>
                <div class="row gx-2 gy-3 row-cols-1">
                
                    <sidenav-group id="zhenqiHeading" :unlocked="data['zhenqi'].unlocked">
                        <sidenav-item id="zhenqiPane" icon="zhenqi.png" :unlocked="data['zhenqi'].unlocked" :prod="data['zhenqi'].prod" :problem="data['zhenqi'].problem" />
                        <sidenav-item id="zhenqiCangPane" icon="zhenqiCang.png" :unlocked="data['zhenqi'].unlocked" :count="data['zhenqi'].count" :storage="data['zhenqi'].storage" />
                    </sidenav-group>
                    
                    <sidenav-group id="teshuHeading" :unlocked="data['xuantan'].unlocked">
                        <sidenav-item id="yuanshenPane" icon="yuanshen.png" :unlocked="data['yuanshen'].unlocked" :prod="data['yuanshen'].prod" :count="data['yuanshen'].count" :storage="data['yuanshen'].storage" :problem="data['yuanshen'].problem" />
                        <sidenav-item id="tiandaoPane" icon="tiandao.png" :unlocked="data['tiandao'].unlocked" :prod="data['tiandao'].prod" :count="data['tiandao'].count" :storage="data['tiandao'].storage" :problem="data['tiandao'].problem" />
                        <sidenav-item id="xuantanPane" icon="xuantan.png" :unlocked="data['xuantan'].unlocked" :prod="data['xuantan'].prod" :count="data['xuantan'].count" :storage="data['xuantan'].storage" :problem="data['xuantan'].problem" />
                    </sidenav-group>

                    <sidenav-group id="fansuHeading" :unlocked="data['lingstone'].unlocked">
                        <sidenav-item id="lingyePane" icon="lingye.png" :unlocked="data['lingye'].unlocked" :prod="data['lingye'].prod" :count="data['lingye'].count" :storage="data['lingye'].storage" />
                        <sidenav-item id="lingstonePane" icon="lingstone.png" :unlocked="data['lingstone'].unlocked" :prod="data['lingstone'].prod" :count="data['lingstone'].count" :storage="data['lingstone'].storage" />
                        <sidenav-item id="baoshiPane" icon="baoshi.png" :unlocked="data['baoshi'].unlocked" :prod="data['baoshi'].prod" :count="data['baoshi'].count" :storage="data['baoshi'].storage" />
                        <sidenav-item id="lingmuPane" icon="lingmu.png" :unlocked="data['lingmu'].unlocked" :prod="data['lingmu'].prod" :count="data['lingmu'].count" :storage="data['lingmu'].storage" />
                        <sidenav-item id="yunjinPane" icon="yunjin.png" :unlocked="data['yunjin'].unlocked" :prod="data['yunjin'].prod" :count="data['yunjin'].count" :storage="data['yunjin'].storage" />
                        <sidenav-item id="leilingPane" icon="leiling.png" :unlocked="data['leiling'].unlocked" :prod="data['leiling'].prod" :count="data['leiling'].count" :storage="data['leiling'].storage" />
                        <sidenav-item id="huoyanPane" icon="huoyan.png" :unlocked="data['huoyan'].unlocked" :prod="data['huoyan'].prod" :count="data['huoyan'].count" :storage="data['huoyan'].storage" />
                    </sidenav-group>

                    <sidenav-group id="lingjieHeading" :unlocked="data['yueshi'].unlocked">
                        <sidenav-item id="yueshiPane" icon="yueshi.png" :unlocked="data['yueshi'].unlocked" :prod="data['yueshi'].prod" :count="data['yueshi'].count" :storage="data['yueshi'].storage" />
                        <sidenav-item id="miasmaPane" icon="miasma.png" :unlocked="data['miasma'].unlocked" :prod="data['miasma'].prod" :count="data['miasma'].count" :storage="data['miasma'].storage" />
                        <sidenav-item id="xuangangPane" icon="xuangang.png" :unlocked="data['xuangang'].unlocked" :prod="data['xuangang'].prod" :count="data['xuangang'].count" :storage="data['xuangang'].storage" />
                        <sidenav-item id="jinshaPane" icon="jinsha.png" :unlocked="data['jinsha'].unlocked" :prod="data['jinsha'].prod" :count="data['jinsha'].count" :storage="data['jinsha'].storage" />
                        <sidenav-item id="yinshaPane" icon="yinsha.png" :unlocked="data['yinsha'].unlocked" :prod="data['yinsha'].prod" :count="data['yinsha'].count" :storage="data['yinsha'].storage" />
                    </sidenav-group>

                    <sidenav-group id="xianyuHeading" :unlocked="data['qingqi'].unlocked">
                        <sidenav-item id="qingqiPane" icon="qingqi.png" :unlocked="data['qingqi'].unlocked" :prod="data['qingqi'].prod" :count="data['qingqi'].count" :storage="data['qingqi'].storage" />
                        <sidenav-item id="taiyiPane" icon="taiyi.png" :unlocked="data['taiyi'].unlocked" :prod="data['taiyi'].prod" :count="data['taiyi'].count" :storage="data['taiyi'].storage" />
                        <sidenav-item id="hanbingPane" icon="hanbing.png" :unlocked="data['hanbing'].unlocked" :prod="data['hanbing'].prod" :count="data['hanbing'].count" :storage="data['hanbing'].storage" />
                    </sidenav-group>

                    <sidenav-group id="wudaoHeading" :unlocked="data['wudao'].unlocked">
                        <sidenav-item id="wudaoPane" icon="wudao.png" :unlocked="data['wudao'].unlocked" :prod="data['wudao'].prod" :count="data['wudao'].count" />
                        <sidenav-item id="gongfaPane" icon="gongfa.png" :unlocked="data['wudao'].unlocked" />
                    </sidenav-group>

                    <sidenav-group id="mijingHeading" :unlocked="data['lingmai'].unlocked">
                        <sidenav-item id="lingmaiPane" icon="lingmai.png" :unlocked="data['lingmai'].unlocked" :prod="data['lingmai'].prod" :count="data['lingmai'].count" />
                        <sidenav-item id="mijingRukouPane" icon="mijingRukou.png" :unlocked="data['mijingRukou1'].unlocked" :done="data['mijingRukou2'].count > 0" doneText="launched" />
                        <sidenav-item id="fanjieMijingPane" icon="fanjieMijing.png" :unlocked="data['yuejing'].unlocked" :done="data['mijingStation'].count > 0" doneText="explored" />
                        <sidenav-item id="xianyuMijingPane" icon="xianyuMijing.png" :unlocked="data['suixing'].unlocked" :done="data['zaohuaRukou1'].count > 0" doneText="explored" />
                    </sidenav-group>

                    <sidenav-group id="tiandaoMijingHeading" :unlocked="data['mijingBaoshi0'].unlocked">
                        <sidenav-item id="mijingStationPane" icon="mijingStation.png" :unlocked="data['mijingBaoshi0'].unlocked" :done="data['mijingBaoshi0'].count > 0 && data['mijingLingmu0'].count > 0 && data['mijingYunjin0'].count > 0 && data['mijingTiandao0'].count > 0" doneText="done" />
                        <sidenav-item id="dongtianPane" icon="dongtian.png" :unlocked="data['mijingBaoshi1'].unlocked || data['mijingLingmu1'].unlocked || data['mijingYunjin1'].unlocked || data['mijingTiandao1'].unlocked" :done="data['mijingBaoshi1'].count > 0 && data['mijingLingmu1'].count > 0 && data['mijingYunjin1'].count > 0 && data['mijingTiandao1'].count > 0" doneText="done" />
                        <sidenav-item id="xianfuPane" icon="xianfu.png" :unlocked="data['mijingChuansong'].unlocked" :done="data['mijingChuansong'].count > 0 && data['mijingFeizhou'].count > 0 && data['mijingFangun'].count > 0 && data['mijingChuansongMen'].count > 0" doneText="done" />
                        <sidenav-item id="tiandiFazhenPane" icon="tiandiFazhen.png" :unlocked="data['mijingXingmen'].unlocked" :done="data['mijingXingmen'].count > 0" doneText="done" />
                    </sidenav-group>

                    <sidenav-group id="zaohuaHeading" :unlocked="data['techYuanshen0'].unlocked">
                        <sidenav-item id="zaohuaPane" icon="zaohua.png" :unlocked="data['techYuanshen0'].unlocked" :done="data['techYuanshen0'].count > 0 && data['techWuhua0'].count > 0 && data['techDafazhen0'].count > 0" doneText="done" />
                        <sidenav-item id="wuhuaPane" icon="wuhua.png" :unlocked="data['wuhua'].unlocked" />
                        <sidenav-item id="dafazhenPane" icon="dafazhen.png" :unlocked="data['lingzhenDuan'].unlocked" />
                    </sidenav-group>

                    <sidenav-group id="mijingTanxianHeading" :unlocked="data['lingyinT1'].unlocked || data['fangun'].unlocked || data['feizhou'].unlocked || data['diziT1'].unlocked">
                        <sidenav-item id="fangunPane" icon="fangun.png" :unlocked="data['fangun'].unlocked" :prod="data['fangun'].prod" :count="data['fangun'].count" :storage="data['fangun'].storage" />
                        <sidenav-item id="lingyinPane" icon="lingyin.png" :unlocked="data['lingyinT1'].unlocked" />
                        <sidenav-item id="feizhouPane" icon="feizhou.png" :unlocked="data['feizhou'].unlocked" :done="data['feizhou'].count > 0" doneText="built" />
                        <sidenav-item id="diziPane" icon="military.png" :unlocked="data['diziT1'].unlocked" />
                        <sidenav-item id="chiyanMijingPane" icon="chiyan.png" :unlocked="data['feizhou'].count > 0" :opinion="data['chiyan'].opinion" />
                        <sidenav-item id="biluoMijingPane" icon="biluo.png" :unlocked="data['feizhou'].count > 0" :opinion="data['biluo'].opinion" />
                        <sidenav-item id="zixiaoMijingPane" icon="zixiao.png" :unlocked="data['feizhou'].count > 0" :opinion="data['zixiao'].opinion" />
                        <sidenav-item id="jinguangMijingPane" icon="jinguang.png" :unlocked="data['feizhou'].count > 0" :opinion="data['jinguang'].opinion" />
                        <sidenav-item id="xuanmingMijingPane" icon="xuanming.png" :unlocked="data['feizhou'].count > 0" :opinion="data['xuanming'].opinion" />
                    </sidenav-group>

                    <sidenav-group id="stargazeHeading" :unlocked="data['tiandaoLaw'].unlocked">
                        <sidenav-item id="tiandaoLawPane" icon="tiandaoLaw.png" :unlocked="data['tiandaoLaw'].unlocked" :count="data['tiandaoLaw'].count" :potential="getPotentialDM" />
                        <sidenav-item id="chiyanChuanchengPane" icon="chiyan.png" :unlocked="data['tiandaoLaw'].unlocked" :opinion="data['chiyan'].opinion" />
                        <sidenav-item id="biluoChuanchengPane" icon="biluo.png" :unlocked="data['tiandaoLaw'].unlocked" :opinion="data['biluo'].opinion" />
                        <sidenav-item id="zixiaoChuanchengPane" icon="zixiao.png" :unlocked="data['tiandaoLaw'].unlocked" :opinion="data['zixiao'].opinion" />
                        <sidenav-item id="jinguangChuanchengPane" icon="jinguang.png" :unlocked="data['tiandaoLaw'].unlocked" :opinion="data['jinguang'].opinion" />
                        <sidenav-item id="xuanmingChuanchengPane" icon="xuanming.png" :unlocked="data['tiandaoLaw'].unlocked" :opinion="data['xuanming'].opinion" />
                        <sidenav-item id="tiandaoChuanchengPane" icon="tiandaoZhuZai.png" :unlocked="data['tiandaoLaw'].unlocked" :opinion="data['tiandaoZhuZai'].opinion" />
                    </sidenav-group>
                    
                </div>
            </inner-content>
        </div>
        <div id="page">
            <top-header>
            
                <div class="col-auto d-lg-none position-relative">
                    <button @click="sidebarOpen = true;">
                        <div v-if="hasNotif" class="position-absolute top-0 end-0" style="line-height:1">
                            <i class="fas fa-fw fa-certificate text-success small"></i>
                        </div>
                        <span class="icon-emoji medium">☯️</span>
                    </button>
                </div>

                                
                <div class="col-auto ms-auto cursor-hover position-relative" data-bs-toggle="tooltip" data-bs-placement="left" :title="$t('achievementPane')">
                    <button @click="setActivePane('achievementPane')">
                        <div v-if="isNotif('achievementPane')" class="position-absolute top-0 end-0" style="line-height:1">
                            <i class="fas fa-fw fa-certificate text-success small"></i>
                        </div>
                        <span class="icon-emoji small">{{ getIcon('trophy.png') }}</span>
                    </button>
                </div>

                <div class="col-auto">
                    <button class="text-normal cursor-hover" data-bs-toggle="dropdown">
                        <span v-if="locale == 'en'" class="flag-icon flag-icon-gb rounded"></span>
                        <span v-if="locale == 'fr'" class="flag-icon flag-icon-fr rounded"></span>
                        <span v-if="locale == 'zh'" class="flag-icon flag-icon-cn rounded"></span>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li>
                            <button class="dropdown-item cursor-hover" @click="changeLocale('zh')">
                                <span class="flag-icon flag-icon-cn rounded me-2"></span>
                                中文
                            </button>
                        </li>
                        <li>
                            <button class="dropdown-item cursor-hover" @click="changeLocale('en')">
                                <span class="flag-icon flag-icon-gb rounded me-2"></span>
                                English
                            </button>
                        </li>
                        <li>
                            <button class="dropdown-item cursor-hover" @click="changeLocale('fr')">
                                <span class="flag-icon flag-icon-fr rounded me-2"></span>
                                Français
                            </button>
                        </li>
                    </ul>
                </div>
                
                <div class="col-auto">
                    <button class="text-light cursor-hover" data-bs-toggle="dropdown">
                        <i class="fas fa-fw fa-ellipsis-v"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li>
                            <button class="dropdown-item cursor-hover" @click="setActivePane('helpPane')">
                                <span class="icon-emoji nav">{{ getIcon('help.png') }}</span>
                                {{ $t('helpPane') }}
                            </button>
                        </li>
                        <li>
                            <button class="dropdown-item cursor-hover" @click="setActivePane('settingsPane')">
                                <span class="icon-emoji nav">{{ getIcon('cog.png') }}</span>
                                {{ $t('settingsPane') }}
                            </button>
                        </li>
                    </ul>
                </div>
                
            </top-header>
            <inner-content data-simplebar role="main">
            
                <div v-if="ghLatestRelease && ghLatestRelease != currentRelease" class="alert alert-warning text-end" role="alert">
                    <small>{{ $t('ghLatestVersion') }}</small>
                    <small class="mx-2">v{{ ghLatestRelease }}</small>
                    <button class="btn" @click="onRefresh()">{{ $t('update') }}</button>
                </div>
                
                <div class="tab-content" style="padding-bottom: 65px;">
                    
                    <!-- 真气 -->
                    <pane id="zhenqiPane" icon="zhenqi.png" :descs="['zhenqiPane_desc']">
                        <resource id="zhenqi" />
                        <buildable id="zhenqiT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="zhenqiT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techZhenqi2" />
                        <buildable id="zhenqiT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="taibai" />
                        <buildable id="zhenqiT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingBaoshi1" />
                        <buildable id="zhenqiT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingLingmu1" />
                        <buildable id="zhenqiT6" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="suixing" />
                    </pane>
                    
                    <!-- 真气池 -->
                    <pane id="zhenqiCangPane" icon="zhenqiCang.png" :descs="['zhenqiCangPane_desc']">
                        <buildable id="zhenqiS1" btnText="build" collapse="true" unlocker="techZhenqiCang1" />
                        <buildable id="zhenqiS2" btnText="build" collapse="true" unlocker="techZhenqiCang2" />
                        <buildable id="zhenqiS3" btnText="build" collapse="true" unlocker="techZhenqiCang3" />
                        <buildable id="zhenqiS4" btnText="build" collapse="true" unlocker="techZhenqiCang4" />
                        <buildable id="zhenqiS5" btnText="build" collapse="true" unlocker="techZhenqiCang5" />
                        <buildable id="zhenqiS6" btnText="build" collapse="true" unlocker="techZhenqiCang6" />
                    </pane>
                    
                    <!-- 元神 -->
                    <pane id="yuanshenPane" icon="yuanshen.png" :descs="['yuanshenPane_desc']">
                        <resource id="yuanshen" />
                        <buildable id="yuanshenT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techYuanshen1" />
                        <buildable id="yuanshenT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techYuanshen2" />
                        <buildable id="yuanshenT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techYuanshen3" />
                        <buildable id="yuanshenT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techYuanshen4" />
                        <buildable id="yuanshenS1" btnText="build" collapse="true" unlocker="techYuanshenCang1" />
                        <buildable id="yuanshenS2" btnText="build" collapse="true" unlocker="techYuanshenCang2" />
                        <buildable id="yuanshenS3" btnText="build" collapse="true" unlocker="techYuanshenCang3" />
                    </pane>
                    
                    <!-- 天道碎片 -->
                    <pane id="tiandaoPane" icon="tiandao.png" :descs="['tiandaoPane_desc']">
                        <resource id="tiandao" />
                        <buildable id="tiandaoS1" btnText="upgrade" collapse="true" />
                        <buildable id="tiandaoT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTiandao1" />
                        <buildable id="tiandaoT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTiandao2" />
                        <buildable id="tiandaoT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTiandao3" />
                        <buildable id="tiandaoT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTiandao4" />
                    </pane>
                    
                    <!-- 玄炭 -->
                    <pane id="xuantanPane" icon="xuantan.png" :descs="['xuantanPane_desc']">
                        <resource id="xuantan" />
                        <buildable id="xuantanS1" btnText="upgrade" collapse="true" unlocker="techCangku" />
                        <buildable id="xuantanT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="xuantanT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techJinglian" />
                        <buildable id="xuantanT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingYunjin1" />
                        <buildable id="xuantanT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingTiandao1" />
                        <buildable id="xuantanT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier5" />
                    </pane>
                    
                    <!-- 灵液 -->
                    <pane id="lingyePane" icon="lingye.png" :descs="['lingyePane_desc']">
                        <resource id="lingye" />
                        <buildable id="lingyeS1" btnText="upgrade" collapse="true" unlocker="techCangku" />
                        <buildable id="lingyeT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="lingyeT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techJinglian" />
                        <buildable id="lingyeT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingYunjin1" />
                        <buildable id="lingyeT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingTiandao1" />
                        <buildable id="lingyeT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier5" />
                    </pane>
                    
                    <!-- 灵石 -->
                    <pane id="lingstonePane" icon="lingstone.png" :descs="['lingstonePane_desc']">
                        <resource id="lingstone" />
                        <buildable id="lingstoneS1" btnText="upgrade" collapse="true" unlocker="techCangku" />
                        <buildable id="lingstoneT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="lingstoneT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techJinglian" />
                        <buildable id="lingstoneT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingYunjin1" />
                        <buildable id="lingstoneT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingTiandao1" />
                        <buildable id="lingstoneT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier5" />
                    </pane>
                    
                    <!-- 陨铁 -->
                    <pane id="baoshiPane" icon="baoshi.png" :descs="['baoshiPane_desc']">
                        <resource id="baoshi" />
                        <buildable id="baoshiS1" btnText="upgrade" collapse="true" unlocker="techCangku" />
                        <buildable id="baoshiT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="baoshiT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techJinglian" />
                        <buildable id="baoshiT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingYunjin1" />
                        <buildable id="baoshiT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingTiandao1" />
                        <buildable id="baoshiT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier5" />
                    </pane>
                    
                    <!-- 灵木 -->
                    <pane id="lingmuPane" icon="lingmu.png" :descs="['lingmuPane_desc']">
                        <resource id="lingmu" />
                        <buildable id="lingmuS1" btnText="upgrade" collapse="true" unlocker="techCangku" />
                        <buildable id="lingmuT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="lingmuT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techJinglian" />
                        <buildable id="lingmuT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingYunjin1" />
                        <buildable id="lingmuT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingTiandao1" />
                        <buildable id="lingmuT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier5" />
                    </pane>
                    
                    <!-- 云晶 -->
                    <pane id="yunjinPane" icon="yunjin.png" :descs="['yunjinPane_desc']">
                        <resource id="yunjin" />
                        <buildable id="yunjinS1" btnText="upgrade" collapse="true" unlocker="techCangku" />
                        <buildable id="yunjinT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="yunjinT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techJinglian" />
                        <buildable id="yunjinT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingYunjin1" />
                        <buildable id="yunjinT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingTiandao1" />
                        <buildable id="yunjinT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier5" />
                    </pane>
                    
                    <!-- 雷灵 -->
                    <pane id="leilingPane" icon="leiling.png" :descs="['leilingPane_desc']">
                        <resource id="leiling" />
                        <buildable id="leilingS1" btnText="upgrade" collapse="true" unlocker="techCangku" />
                        <buildable id="leilingT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="leilingT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techJinglian" />
                        <buildable id="leilingT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingYunjin1" />
                        <buildable id="leilingT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingTiandao1" />
                        <buildable id="leilingT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier5" />
                    </pane>
                    
                    <!-- 地火 -->
                    <pane id="huoyanPane" icon="huoyan.png" :descs="['huoyanPane_desc']">
                        <resource id="huoyan" />
                        <buildable id="huoyanS1" btnText="upgrade" collapse="true" unlocker="techCangku" />
                        <buildable id="huoyanT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="huoyanT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techJinglian" />
                        <buildable id="huoyanT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingYunjin1" />
                        <buildable id="huoyanT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingTiandao1" />
                        <buildable id="huoyanT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier5" />
                    </pane>
                    
                    <!-- 月华石 -->
                    <pane id="yueshiPane" icon="yueshi.png" :descs="['yueshiPane_desc']">
                        <resource id="yueshi" />
                        <buildable id="yueshiS1" btnText="upgrade" collapse="true" unlocker="techCangku" />
                        <buildable id="yueshiT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="yueshiT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techJinglian" />
                        <buildable id="yueshiT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingYunjin1" />
                        <buildable id="yueshiT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingTiandao1" />
                        <buildable id="yueshiT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier5" />
                    </pane>
                    
                    <!-- 瘴气 -->
                    <pane id="miasmaPane" icon="miasma.png" :descs="['miasmaPane_desc']">
                        <resource id="miasma" />
                        <buildable id="miasmaS1" btnText="upgrade" collapse="true" unlocker="techCangku" />
                        <buildable id="miasmaT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="miasmaT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techJinglian" />
                        <buildable id="miasmaT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingYunjin1" />
                        <buildable id="miasmaT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingTiandao1" />
                        <buildable id="miasmaT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier5" />
                    </pane>
                    
                    <!-- 玄钢 -->
                    <pane id="xuangangPane" icon="xuangang.png" :descs="['xuangangPane_desc']">
                        <resource id="xuangang" />
                        <buildable id="xuangangS1" btnText="upgrade" collapse="true" unlocker="techCangku" />
                        <buildable id="xuangangT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="xuangangT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techJinglian" />
                        <buildable id="xuangangT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingYunjin1" />
                        <buildable id="xuangangT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingTiandao1" />
                        <buildable id="xuangangT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier5" />
                    </pane>
                    
                    <!-- 金砂 -->
                    <pane id="jinshaPane" icon="jinsha.png" :descs="['jinshaPane_desc']">
                        <resource id="jinsha" />
                        <buildable id="jinshaS1" btnText="upgrade" collapse="true" unlocker="techCangku" />
                        <buildable id="jinshaT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="jinshaT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techJinglian" />
                        <buildable id="jinshaT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingYunjin1" />
                        <buildable id="jinshaT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingTiandao1" />
                        <buildable id="jinshaT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier5" />
                    </pane>
                    
                    <!-- 银砂 -->
                    <pane id="yinshaPane" icon="yinsha.png" :descs="['yinshaPane_desc']">
                        <resource id="yinsha" />
                        <buildable id="yinshaS1" btnText="upgrade" collapse="true" unlocker="techCangku" />
                        <buildable id="yinshaT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="yinshaT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techJinglian" />
                        <buildable id="yinshaT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingYunjin1" />
                        <buildable id="yinshaT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingTiandao1" />
                        <buildable id="yinshaT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier5" />
                    </pane>
                    
                    <!-- 清气 -->
                    <pane id="qingqiPane" icon="qingqi.png" :descs="['qingqiPane_desc']">
                        <resource id="qingqi" />
                        <buildable id="qingqiS1" btnText="upgrade" collapse="true" unlocker="techCangku" />
                        <buildable id="qingqiT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="qingqiT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techJinglian" />
                        <buildable id="qingqiT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingYunjin1" />
                        <buildable id="qingqiT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingTiandao1" />
                        <buildable id="qingqiT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier5" />
                    </pane>
                    
                    <!-- 太乙 -->
                    <pane id="taiyiPane" icon="taiyi.png" :descs="['taiyiPane_desc']">
                        <resource id="taiyi" />
                        <buildable id="taiyiS1" btnText="upgrade" collapse="true" unlocker="techCangku" />
                        <buildable id="taiyiT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="taiyiT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techJinglian" />
                        <buildable id="taiyiT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingYunjin1" />
                        <buildable id="taiyiT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingTiandao1" />
                        <buildable id="taiyiT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier5" />
                    </pane>
                    
                    <!-- 寒冰 -->
                    <pane id="hanbingPane" icon="hanbing.png" :descs="['hanbingPane_desc']">
                        <resource id="hanbing" />
                        <buildable id="hanbingS1" btnText="upgrade" collapse="true" unlocker="techCangku" />
                        <buildable id="hanbingT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="hanbingT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techJinglian" />
                        <buildable id="hanbingT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingYunjin1" />
                        <buildable id="hanbingT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="mijingTiandao1" />
                        <buildable id="hanbingT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier5" />
                    </pane>
                    
                    <!-- 悟道 -->
                    <pane id="wudaoPane" icon="wudao.png" :descs="['wudaoPane_desc']">
                        <buildable id="wudaoT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="wudaoT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techWudao2" />
                        <buildable id="wudaoT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techWudao3" />
                        <buildable id="wudaoT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techWudao4" />
                        <buildable id="wudaoT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techWudao5" />
                    </pane>
                    
                    <!-- 功法 -->
                    <pane id="gongfaPane" icon="gongfa.png" :descs="['gongfaPane_desc']">
                        <buildable id="techCangku" btnText="unlock" />
                        <buildable id="techZhenqi1" btnText="unlock" />
                        <buildable id="techLingye" btnText="unlock" unlocker="techCangku" />
                        <buildable id="techZhenqi2" btnText="unlock" unlocker="techZhenqi1" />
                        <buildable id="techJinglian" btnText="unlock" unlocker="techZhenqi1" />
                        <buildable id="techSuimie" btnText="unlock" unlocker="techJinglian" />
                        <buildable id="techLingmai1" btnText="unlock" unlocker="techJinglian" />
                        <buildable id="techLingmai2" btnText="unlock" unlocker="techLingmai1" />
                        <buildable id="techLingmai3" btnText="unlock" unlocker="techLingmai2" />
                        <buildable id="techWudao2" btnText="unlock" unlocker="techLingmai1" />
                        <buildable id="techWudao3" btnText="unlock" unlocker="techWudao2" />
                        <buildable id="techWudao4" btnText="unlock" unlocker="techWudao3" />
                        <buildable id="techZhenqiCang1" btnText="unlock" unlocker="upgradeZhenqi2" />
                        <buildable id="techZhenqiCang2" btnText="unlock" unlocker="techZhenqiCang1" />
                        <buildable id="techZhenqiCang3" btnText="unlock" unlocker="techZhenqiCang2" />
                        <buildable id="techZhenqiCang4" btnText="unlock" unlocker="techZhenqiCang4" />
                        <buildable id="techYuanshen1" btnText="unlock" unlocker="techYuanshen0" />
                        <buildable id="techYuanshen2" btnText="unlock" unlocker="techYuanshen1" />
                        <buildable id="techYuanshenCang1" btnText="unlock" unlocker="techYuanshen1" />
                        <buildable id="techYuanshenCang2" btnText="unlock" unlocker="techYuanshenCang1" />
                        <buildable id="techWuhua1" btnText="unlock" unlocker="techWuhua0" />
                        <buildable id="techTiandao0" btnText="unlock" unlocker="techWuhua1" />
                        <buildable id="techTiandao1" btnText="unlock" unlocker="mijingTiandao1" />
                        <buildable id="techTiandao2" btnText="unlock" unlocker="techTiandao1" />
                        <buildable id="techDafazhen1" btnText="unlock" unlocker="techDafazhen0" />
                        <buildable id="techDafazhen2" btnText="unlock" unlocker="techDafazhen1" />
                        <buildable id="techChongqun1" btnText="unlock" unlocker="techChongqun0" />
                        <buildable id="upgradeJinglian" btnText="upgrade" unlocker="techJinglian" />
                        <buildable id="upgradeZhenqi1" btnText="upgrade" unlocker="techZhenqi1" />
                        <buildable id="upgradeZhenqi2" btnText="upgrade" unlocker="techZhenqi2" />
                        <buildable id="boostChanwu" btnText="boost" />
                        <buildable id="boostWudao" btnText="boost" />
                        <buildable id="boostZhenqi" btnText="boost" />
                        <buildable id="boostZhenqiCang" btnText="boost" />
                    </pane>
                    
                    <!-- 灵脉 -->
                    <pane id="lingmaiPane" icon="lingmai.png" :descs="['lingmaiPane_desc']">
                        <resource id="lingmai" />
                        <buildable id="lingmaiT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="lingmaiT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techLingmai2" />
                        <buildable id="lingmaiT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techLingmai3" />
                    </pane>
                    
                    <!-- 秘境入口 -->
                    <pane id="mijingRukouPane" icon="mijingRukou.png" :descs="['mijingRukouPane_desc']">
                        <buildable id="mijingRukou1" btnText="build" />
                        <buildable id="mijingRukou2" btnText="launch" unlocker="mijingRukou1" />
                    </pane>
                    
                    <!-- 凡界秘境 -->
                    <pane id="fanjieMijingPane" icon="fanjieMijing.png">
                        <buildable id="yuejing" btnText="explore" />
                        <buildable id="chenxing" btnText="explore" />
                        <buildable id="taibai" btnText="explore" />
                        <buildable id="yinghuo" btnText="explore" />
                        <buildable id="xingchen" btnText="explore" />
                        <buildable id="mijingStation" btnText="explore" unlocker="xingchen" />
                    </pane>

                    <!-- 仙域秘境 -->
                    <pane id="xianyuMijingPane" icon="xianyuMijing.png">
                        <buildable id="suixing" btnText="explore" />
                        <buildable id="zhenxing" btnText="explore" />
                        <buildable id="tianwang" btnText="explore" />
                        <buildable id="haiwang" btnText="explore" />
                        <buildable id="mingxing" btnText="explore" />
                        <buildable id="zaohuaRukou0" btnText="explore" unlocker="mingxing" />
                        <buildable id="zaohuaRukou1" btnText="explore" unlocker="zaohuaRukou0" />
                    </pane>

                    <!-- 天道秘境 -->
                    <pane id="mijingStationPane" icon="mijingStation.png" :descs="['mijingStationPane_desc']">
                        <buildable id="mijingBaoshi0" btnText="build" />
                        <buildable id="mijingLingmu0" btnText="build" />
                        <buildable id="mijingYunjin0" btnText="build" />
                        <buildable id="mijingTiandao0" btnText="build" />
                    </pane>

                    <!-- 洞天福地 -->
                    <pane id="dongtianPane" icon="dongtian.png">
                        <buildable id="mijingBaoshi1" btnText="activate" />
                        <buildable id="mijingLingmu1" btnText="activate" />
                        <buildable id="mijingYunjin1" btnText="activate" />
                        <buildable id="mijingTiandao1" btnText="activate" />
                    </pane>

                    <!-- 仙府灵核 -->
                    <pane id="xianfuPane" icon="xianfu.png">
                        <buildable id="mijingChuansong" btnText="activate" />
                        <buildable id="mijingFeizhou" btnText="activate" />
                        <buildable id="mijingFangun" btnText="activate" />
                        <buildable id="mijingChuansongMen" btnText="activate" />
                    </pane>

                    <!-- 天地法阵 -->
                    <pane id="tiandiFazhenPane" icon="tiandiFazhen.png">
                        <buildable id="mijingXingmen" btnText="activate" />
                    </pane>
                    
                    <!-- 造化之炉 -->
                    <pane id="zaohuaPane" icon="zaohua.png">
                        <buildable id="techYuanshen0" btnText="unlock" />
                        <buildable id="techWuhua0" btnText="unlock" />
                        <buildable id="techDafazhen0" btnText="unlock" />
                    </pane>
                    
                    <!-- 五行转化 -->
                    <pane id="wuhuaPane" icon="wuhua.png" :descs="['wuhuaPane_desc']">
                        <card checked="true">
                            <div class="col-12">
                                <div class="row gx-3">
                                    <div class="col">
                                        <div class="small">{{ $t('selectEmcAmount') }}</div>
                                        <select class="form-control" v-model="selectedEmcAmount" @change="setEmcAmount(selectedEmcAmount)">
                                            <option value="max">Max</option>
                                            <option value="1">1</option>
                                            <option value="10">10</option>
                                            <option value="100">100</option>
                                            <option value="1000">{{ numeralFormat(1000, '0a') }}</option>
                                            <option value="10000">{{ numeralFormat(10000, '0a') }}</option>
                                            <option value="100000">{{ numeralFormat(100000, '0a') }}</option>
                                        </select>
                                    </div>
                                    <div v-if="data['autoWuhua'].count > 0" class="col">
                                        <div class="small">{{ $t('selectAutoEmcInterval') }}</div>
                                        <select class="form-control" v-model="selectedAutoEmcInterval" @change="setAutoEmcInterval(selectedAutoEmcInterval)">
                                            <option value="1">{{ $t('1second') }}</option>
                                            <option value="10">{{ $t('10second') }}</option>
                                            <option value="60">{{ $t('1minute') }}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </card>
                        <card checked="true">
                            <div class="col-12">
                                <div class="row g-1">
                                    <wuhua id="wuhuaTiandao" />
                                    <wuhua id="wuhuaXuantan" />
                                    <wuhua id="wuhuaLingye" />
                                    <wuhua id="wuhuaLingstone" />
                                    <wuhua id="wuhuaBaoshi" />
                                    <wuhua id="wuhuaLingmu" />
                                    <wuhua id="wuhuaYunjin" />
                                    <wuhua id="wuhuaLeiling" />
                                    <wuhua id="wuhuaHuoyan" />
                                    <wuhua id="wuhuaYueshi" />
                                    <wuhua id="wuhuaMiasma" />
                                    <wuhua id="wuhuaXuangang" />
                                    <wuhua id="wuhuaJinsha" />
                                    <wuhua id="wuhuaYinsha" />
                                    <wuhua id="wuhuaQingqi" />
                                    <wuhua id="wuhuaTaiyi" />
                                    <wuhua id="wuhuaHanbing" />
                                </div>
                            </div>
                        </card>
                    </pane>
                    
                    <!-- 护宗大阵 -->
                    <pane id="dafazhenPane" icon="dafazhen.png" :descs="['dafazhenPane_desc']">
                        <buildable id="lingzhenDuan" btnText="build" />
                        <buildable id="dafazhenT1" btnText="build" />
                        <buildable id="dafazhenT2" btnText="build" />
                        <buildable id="dafazhenT3" btnText="build" />
                    </pane>
                    
                    <!-- 反魂 -->
                    <pane id="fangunPane" icon="fangun.png" :descs="['fangunPane_desc']">
                        <buildable id="fangunT1" btnText="build" />
                    </pane>
                    
                    <!-- 灵音阵 -->
                    <pane id="lingyinPane" icon="lingyin.png" :descs="['lingyinPane_desc']">
                        <buildable id="lingyinT1" btnText="build" />
                        <buildable id="lingyinT2" btnText="build" />
                    </pane>
                    
                    <!-- 飞舟 -->
                    <pane id="feizhouPane" icon="feizhou.png" :descs="['feizhouPane_desc']">
                        <buildable id="feizhou" btnText="build" />
                        <buildable id="huti" btnText="build" />
                        <buildable id="dunfa" btnText="build" />
                        <buildable id="lingyi" btnText="build" />
                    </pane>
                    
                    <!-- 弟子 -->
                    <pane id="diziPane" icon="military.png">
                        <fleet id="fleet" />
                        <buildable id="diziT1" btnText="build" />
                        <buildable id="diziT2" btnText="build" />
                        <buildable id="diziT3" btnText="build" />
                        <buildable id="diziT4" btnText="build" />
                        <buildable id="diziT5" btnText="build" />
                    </pane>
                    
                    <!-- 赤焰宗秘境 -->
                    <pane id="chiyanMijingPane" icon="chiyan.png" :descs="['chiyanMijingPane_desc']">
                        <star id="star301"    /> <star id="star163901" /> <star id="star181901" /> <star id="star151801" /> <star id="star25401"  /> <star id="star146301" />
                        <star id="star122601" /> <star id="star79501"  /> <star id="star1501"   /> <star id="star79901"  /> <star id="star37601"  /> <star id="star123401" />
                        <star id="star164301" /> <star id="star219102" /> <star id="star204702" /> <star id="star116901" /> <star id="star74001"  /> <star id="star205102" />
                        <star id="star144001" /> <star id="star222301" /> <star id="star3901"   /> <star id="star168301" /> <star id="star120901" /> <star id="star125301" />
                        <star id="star113101" /> <star id="star89101"  /> <star id="star93901"  /> <star id="star79201"  /> <star id="star80501"  /> <star id="star77301"  />
                        <star id="star191701" /> <star id="star199702" /> <star id="star21001"  /> <star id="star178302" /> <star id="star32201"  /> <star id="star74801"  />
                    </pane>
                    
                    <!-- 碧落宗秘境 -->
                    <pane id="biluoMijingPane" icon="biluo.png" :descs="['biluoMijingPane_desc']">
                        <star id="star401"    /> <star id="star25101"  /> <star id="star207601" /> <star id="star223901" /> <star id="star121101" /> <star id="star136701" />
                        <star id="star166402" /> <star id="star95001"  /> <star id="star175902" /> <star id="star56501"  /> <star id="star167801" /> <star id="star103201" />
                        <star id="star113301" /> <star id="star199602" /> <star id="star157201" /> <star id="star222201" /> <star id="star6301"   /> <star id="star214301" />
                        <star id="star40801"  /> <star id="star207301" /> <star id="star169601" /> <star id="star157101" /> <star id="star178501" /> <star id="star208601" />
                        <star id="star78101"  /> <star id="star123501" /> <star id="star85901"  /> <star id="star18501"  /> <star id="star199801" /> <star id="star141901" />
                        <star id="star5201"   /> <star id="star223701" /> <star id="star166903" /> <star id="star32101"  /> <star id="star77801"  /> <star id="star205201" />
                    </pane>
                    
                    <!-- 紫霄宗秘境 -->
                    <pane id="zixiaoMijingPane" icon="zixiao.png" :descs="['zixiaoMijingPane_desc']">
                        <star id="star201"    /> <star id="star217101" /> <star id="star166701" /> <star id="star179501" /> <star id="star6501"   /> <star id="star222401" />
                        <star id="star200001" /> <star id="star24201"  /> <star id="star224202" /> <star id="star92801"  /> <star id="star172701" /> <star id="star86401"  />
                        <star id="star202902" /> <star id="star177001" /> <star id="star68301"  /> <star id="star205001" /> <star id="star13401"  /> <star id="star34201"  />
                        <star id="star182101" /> <star id="star178401" /> <star id="star107601" /> <star id="star192101" /> <star id="star24001"  /> <star id="star16601"  />
                        <star id="star27501"  /> <star id="star121601" /> <star id="star212102" /> <star id="star117501" />
                    </pane>
                    
                    <!-- 金光宗秘境 -->
                    <pane id="jinguangMijingPane" icon="jinguang.png" :descs="['jinguangMijingPane_desc']">
                        <star id="star501"    /> <star id="star130601" /> <star id="star158101" /> <star id="star224601" /> <star id="star58601"  /> <star id="star10101"  />
                        <star id="star194201" /> <star id="star1101"   /> <star id="star72501"  /> <star id="star210501" /> <star id="star189701" /> <star id="star175601" />
                        <star id="star206902" /> <star id="star133601" /> <star id="star135801" /> <star id="star39101"  /> <star id="star107001" /> <star id="star105801" />
                        <star id="star224201" /> <star id="star205101" /> <star id="star162501" /> <star id="star4001"   /> <star id="star141101" /> <star id="star180502" />
                        <star id="star208702" /> <star id="star85501"  /> <star id="star217202" /> <star id="star180101" /> <star id="star13801"  /> <star id="star37101"  />
                        <star id="star42501"  /> <star id="star80901"  /> <star id="star215902" /> <star id="star190502" /> <star id="star99701"  /> <star id="star176802" />
                    </pane>
                    
                    <!-- 玄冥宗秘境 -->
                    <pane id="xuanmingMijingPane" icon="xuanming.png" :descs="['xuanmingMijingPane_desc']">
                        <star id="star701"    /> <star id="star601"    /> <star id="star80101"  /> <star id="star213301" /> <star id="star13601"  /> <star id="star51801"  />
                        <star id="star35801"  /> <star id="star216801" /> <star id="star224101" /> <star id="star114001" /> <star id="star15301"  /> <star id="star69601"  />
                        <star id="star148501" /> <star id="star155801" /> <star id="star185101" /> <star id="star175901" /> <star id="star203902" /> <star id="star204801" />
                        <star id="star211202" /> <star id="star100801" /> <star id="star124101" /> <star id="star139701" /> <star id="star50401"  /> <star id="star159101" />
                        <star id="star148101" /> <star id="star157301" /> <star id="star72601"  /> <star id="star224801" /> <star id="star71001"  /> <star id="star207501" />
                        <star id="star168302" /> <star id="star128901" /> <star id="star68401"  /> <star id="star30701"  /> <star id="star193402" /> <star id="star84201"  />
                        <star id="star76401"  /> <star id="star32301"  /> <star id="star191401" /> <star id="star118301" /> <star id="star166901" /> <star id="star62901"  />
                        <star id="star21601"  /> <star id="star63801"  /> <star id="star187202" />
                    </pane>
                    
                    <!-- 天道法则 -->
                    <pane id="tiandaoLawPane" icon="tiandaoLaw.png" :descs="['tiandaoLawPane_desc1', 'tiandaoLawPane_desc2', 'tiandaoLawPane_desc3', 'tiandaoLawPane_desc4', 'tiandaoLawPane_desc5']">
                        <card id="tiandaoLaw" :descs="['tiandaoLaw_desc']">
                            <div class="col-12">
                                <div class="heading-6">{{ $t('dmWonders') }} <span class="text-light">{{ getDMWonders }}</span></div>
                                <div class="small"><span>{{ $t('dmWonders_desc') }}</span></div>
                            </div>
                            <div class="col-12">
                                <div class="heading-6">{{ $t('dmSpheres') }} <span class="text-light">{{ getDMSpheres }}</span></div>
                                <div class="small"><span>{{ $t('dmSpheres_desc') }}</span></div>
                            </div>
                            <div class="col-12">
                                <div class="heading-6">{{ $t('dmResearches') }} <span class="text-light">{{ getDMResearches }}</span></div>
                                <div class="small"><span>{{ $t('dmResearches_desc') }}</span></div>
                            </div>
                            <div class="col-12">
                                <div class="heading-6">{{ $t('dmRank') }} <span class="text-light">{{ getDMRank }}</span></div>
                                <div class="small"><span>{{ $t('dmRank_desc') }}</span></div>
                            </div>
                            <div class="col-12">
                                <div class="heading-6">{{ $t('dmSwarms') }} <span class="text-light">{{ getDMSwarms }}</span></div>
                                <div class="small"><span>{{ $t('dmSwarms_desc') }}</span></div>
                            </div>
                        </card>
                        <card id="rebirth" :descs="['rebirth_desc']">
                            <div class="col-12">
                                <div class="row g-1 justify-content-end">
                                    <div class="col-auto">
                                        <button class="btn btn-warning" @click="rebirthModal.show()">{{ $t('rebirth') }}</button>
                                    </div>
                                </div>
                            </div>
                        </card>
                    </pane>
                    
                    <!-- 赤焰传承 -->
                    <pane id="chiyanChuanchengPane" icon="chiyan.png" :descs="['chiyanChuanchengPane_desc']">
                        <buildable id="upgradeLingqu" btnText="activate" />
                        <buildable id="upgradeCangku1" btnText="activate" />
                        <buildable id="upgradeCangku2" btnText="activate" />
                        <buildable id="techZhenqiCang6" btnText="activate" />
                        <buildable id="upgradeCangku3" btnText="activate" />
                    </pane>
                    
                    <!-- 碧落传承 -->
                    <pane id="biluoChuanchengPane" icon="biluo.png" :descs="['biluoChuanchengPane_desc']">
                        <buildable id="techYuanshen3" btnText="activate" />
                        <buildable id="upgradeMijing1" btnText="activate" />
                        <buildable id="techYuanshenCang3" btnText="activate" />
                        <buildable id="upgradeMijing2" btnText="activate" />
                        <buildable id="upgradeMijing3" btnText="activate" />
                        <buildable id="autoWuhua" btnText="activate" />
                        <buildable id="techYuanshen4" btnText="activate" />
                    </pane>
                    
                    <!-- 紫霄传承 -->
                    <pane id="zixiaoChuanchengPane" icon="zixiao.png" :descs="['zixiaoChuanchengPane_desc']">
                        <buildable id="upgradeWudao1" btnText="activate" />
                        <buildable id="upgradeWudao2" btnText="activate" />
                        <buildable id="techWudao5" btnText="activate" />
                        <buildable id="upgradeZhenqiBoost" btnText="activate" />
                    </pane>
                    
                    <!-- 金光传承 -->
                    <pane id="jinguangChuanchengPane" icon="jinguang.png" :descs="['jinguangChuanchengPane_desc']">
                        <buildable id="upgradeTier1" btnText="activate" />
                        <buildable id="techZhenqiCang5" btnText="activate" />
                        <buildable id="multiBuy" btnText="activate" />
                        <buildable id="boostLingyun" btnText="activate" />
                        <buildable id="techTier5" btnText="activate" />
                    </pane>
                    
                    <!-- 玄冥传承 -->
                    <pane id="xuanmingChuanchengPane" icon="xuanming.png" :descs="['xuanmingChuanchengPane_desc']">
                        <buildable id="upgradeLingmai1" btnText="activate" />
                        <buildable id="upgradeDizi" btnText="activate" />
                        <buildable id="techTiandao3" btnText="activate" />
                        <buildable id="techTiandao4" btnText="activate" />
                    </pane>
                    
                    <!-- 天道传承 -->
                    <pane id="tiandaoChuanchengPane" icon="tiandaoZhuZai.png" :descs="['tiandaoChuanchengPane_desc']">
                        <buildable id="boostTiandaoLaw" btnText="activate" />
                        <buildable id="upgradeZongmen" btnText="activate" />
                    </pane>
                        
                    <!-- 布施 -->
                    <pane id="donatingPane" icon="donating.png" :descs="['donatingPane_desc1', 'donatingPane_desc2']">
                        <card id="donatingPane_desc3" checked="true">
                            <div class="col-12">
                                <form class="row g-2 justify-content-end align-items-end" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
                                    <input type="hidden" name="cmd" value="_s-xclick">
                                    <input type="hidden" name="hosted_button_id" value="7XYD7SJFKQ8M4">
                                    <div class="col-12 text-end">
                                        <small>{{ $t('donatingPane_desc4') }}</small>
                                    </div>
                                    <div class="col-12 text-end">
                                        <button type="submit" class="btn">
                                            <div class="row gx-2 align-items-center">
                                                <div class="col-auto d-flex align-items-center"><span class="icon-emoji small">{{ getIcon('paypal.png') }}</span></div>
                                                <div class="col-auto">{{ $t('donate') }}</div>
                                            </div>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </card>
                    </pane>
                    
                    <!-- 成就 -->
                    <pane id="achievementPane" icon="trophy.png" :descs="['achievementPane_desc']">
                        <card id="currentRank" checked="true">
                            <div class="col-12">
                                <small>{{ rank.level }} - {{ $t('rank_' + rank.level) }}</small>
                                <div class="progress">
                                    <div class="progress-bar progress-bar-striped progress-bar-animated" :style="'width: ' + rank.percent + '%'">
                                        <div class="small">
                                            <span>{{ rank.percent }}%</span>
                                            <span class="ms-1">{{ rank.current }}</span>
                                            <small>/{{ rank.xpNeeded }}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </card>
                        <card id="statistics" checked="true">
                            <div class="col-12">
                                <table class="table">
                                    <tbody>
                                        <tr>
                                            <td><small class="text-normal">{{ $t('startDate') }}</small></td>
                                            <td class="text-end"><small class="text-light">{{ momentFormat(stats.startDate, 'YYYY-MM-DD') }}</small></td>
                                        </tr>
                                        <tr>
                                            <td><small class="text-normal">{{ $t('lastRebirthDate') }}</small></td>
                                            <td class="text-end"><small class="text-light">{{ momentFormat(stats.lastRebirthDate, 'YYYY-MM-DD') }}</small></td>
                                        </tr>
                                        <tr>
                                            <td><small class="text-normal">{{ $t('rebirthCount') }}</small></td>
                                            <td class="text-end"><small class="text-light">{{ numeralFormat(stats.rebirthCount, '0a') }}</small></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="col-12">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <td></td>
                                            <td width="1%" nowrap class="text-end"><small>{{ $t('current') }}</small></td>
                                            <td width="1%" nowrap class="text-end"><small>{{ $t('allTime') }}</small></td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><small class="text-normal">{{ $t('tiandaoLaw') }}</small></td>
                                            <td class="text-end"><small class="text-light">{{ numeralFormat(data['tiandaoLaw'].count.toPrecision(4), '0.[000]a') }}</small></td>
                                            <td class="text-end"><small class="text-light">{{ numeralFormat(stats.allTimeTiandaoLaw.toPrecision(4), '0.[000]a') }}</small></td>
                                        </tr>
                                        <tr>
                                            <td><small class="text-normal">{{ $t('manualGain') }}</small></td>
                                            <td class="text-end"><small class="text-light">{{ numeralFormat(stats.manualGain.current.toPrecision(4), '0.[000]a') }}</small></td>
                                            <td class="text-end"><small class="text-light">{{ numeralFormat(stats.manualGain.allTime.toPrecision(4), '0.[000]a') }}</small></td>
                                        </tr>
                                        <tr>
                                            <td><small class="text-normal">{{ $t('machineT1') }}</small></td>
                                            <td class="text-end"><small class="text-light">{{ numeralFormat(stats.machineT1.current.toPrecision(4), '0.[000]a') }}</small></td>
                                            <td class="text-end"><small class="text-light">{{ numeralFormat(stats.machineT1.allTime.toPrecision(4), '0.[000]a') }}</small></td>
                                        </tr>
                                        <tr>
                                            <td><small class="text-normal">{{ $t('machineT2') }}</small></td>
                                            <td class="text-end"><small class="text-light">{{ numeralFormat(stats.machineT2.current.toPrecision(4), '0.[000]a') }}</small></td>
                                            <td class="text-end"><small class="text-light">{{ numeralFormat(stats.machineT2.allTime.toPrecision(4), '0.[000]a') }}</small></td>
                                        </tr>
                                        <tr>
                                            <td><small class="text-normal">{{ $t('machineT3') }}</small></td>
                                            <td class="text-end"><small class="text-light">{{ numeralFormat(stats.machineT3.current.toPrecision(4), '0.[000]a') }}</small></td>
                                            <td class="text-end"><small class="text-light">{{ numeralFormat(stats.machineT3.allTime.toPrecision(4), '0.[000]a') }}</small></td>
                                        </tr>
                                        <tr>
                                            <td><small class="text-normal">{{ $t('machineT4') }}</small></td>
                                            <td class="text-end"><small class="text-light">{{ numeralFormat(stats.machineT4.current.toPrecision(4), '0.[000]a') }}</small></td>
                                            <td class="text-end"><small class="text-light">{{ numeralFormat(stats.machineT4.allTime.toPrecision(4), '0.[000]a') }}</small></td>
                                        </tr>
                                        <tr>
                                            <td><small class="text-normal">{{ $t('machineT5') }}</small></td>
                                            <td class="text-end"><small class="text-light">{{ numeralFormat(stats.machineT5.current.toPrecision(4), '0.[000]a') }}</small></td>
                                            <td class="text-end"><small class="text-light">{{ numeralFormat(stats.machineT5.allTime.toPrecision(4), '0.[000]a') }}</small></td>
                                        </tr>
                                        <tr>
                                            <td><small class="text-normal">{{ $t('machineT6') }}</small></td>
                                            <td class="text-end"><small class="text-light">{{ numeralFormat(stats.machineT6.current.toPrecision(4), '0.[000]a') }}</small></td>
                                            <td class="text-end"><small class="text-light">{{ numeralFormat(stats.machineT6.allTime.toPrecision(4), '0.[000]a') }}</small></td>
                                        </tr>
                                        <tr>
                                            <td><small class="text-normal">{{ $t('ships') }}</small></td>
                                            <td class="text-end"><small class="text-light">{{ numeralFormat(stats.ships.current.toPrecision(4), '0.[000]a') }}</small></td>
                                            <td class="text-end"><small class="text-light">{{ numeralFormat(stats.ships.allTime.toPrecision(4), '0.[000]a') }}</small></td>
                                        </tr>
                                        <tr>
                                            <td><small class="text-normal">{{ $t('starOwned') }}</small></td>
                                            <td class="text-end"><small class="text-light">{{ numeralFormat(stats.starOwned.current.toPrecision(4), '0.[000]a') }}</small></td>
                                            <td class="text-end"><small class="text-light">{{ numeralFormat(stats.starOwned.allTime.toPrecision(4), '0.[000]a') }}</small></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </card>
                        <card id="resources" checked="true">
                            <div class="col-12 mt-2">
                                <div class="row g-1">
                                    <div v-for="ach in resAchievements" :key="ach.id" class="col-12 col-md-4">
                                        <div class="rounded px-3 py-2" :class="{ 'opacity-1':!ach.unlocked }" style="background-color:rgba(255,255,255,.125);">
                                            <div class="row g-1">
                                                <div class="col-12 small">
                                                    <div class="row gx-2">
                                                        <div class="col-auto d-flex align-items-center">
                                                            <span class="icon-emoji small">{{ getIcon(ach.icon) }}</span>
                                                        </div>
                                                        <div class="col-auto">
                                                            <span class="h6 text-light">{{ $t(ach.data) }}</span>
                                                        </div>
                                                        <div v-if="!ach.unlocked" class="col">
                                                            <span class="text-normal">{{ $t('locked') }}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-12 small">
                                                    <div class="row g-1 mb-2">
                                                        <div v-for="(bracket, index) in ach.brackets" :key="bracket" class="col">
                                                            <small class="text-uppercase" :class="{ 'text-success':ach.count > index, 'text-timer':ach.count == index, 'text-muted':ach.count < index }">{{ numeralFormat(bracket, '0a') }}</small>
                                                            <div class="progress rounded" style="height:3px">
                                                                <div v-if="ach.count > index" class="progress-bar bg-success" style="width:100%"></div>
                                                                <div v-if="ach.count == index" class="progress-bar bg-timer" :style="'width:' + ach.progress + '%'"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </card>
                        <card id="producers" checked="true">
                            <div class="col-12 mt-2">
                                <div class="row g-1">
                                    <div v-for="ach in prodAchievements" :key="ach.id" class="col-12 col-md-4">
                                        <div class="rounded px-3 py-2" :class="{ 'opacity-1':!ach.unlocked }" style="background-color:rgba(255,255,255,.125);">
                                            <div class="row g-1">
                                                <div class="col-12 small">
                                                    <div class="row gx-2">
                                                        <div class="col-auto d-flex align-items-center">
                                                            <span class="icon-emoji small">{{ getIcon(ach.icon) }}</span>
                                                        </div>
                                                        <div class="col text-truncate">
                                                            <span class="h6 text-light">{{ $t(ach.data) }}</span>
                                                        </div>
                                                        <div v-if="!ach.unlocked" class="col-auto">
                                                            <span class="text-normal">{{ $t('locked') }}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-12 small">
                                                    <div class="row g-1 mb-2">
                                                        <div v-for="(bracket, index) in ach.brackets" :key="bracket" class="col">
                                                            <small class="text-uppercase" :class="{ 'text-success':ach.count > index, 'text-timer':ach.count == index, 'text-muted':ach.count < index }">{{ numeralFormat(bracket, '0a') }}</small>
                                                            <div class="progress rounded" style="height:3px">
                                                                <div v-if="ach.count > index" class="progress-bar bg-success" style="width:100%"></div>
                                                                <div v-if="ach.count == index" class="progress-bar bg-timer" :style="'width:' + ach.progress + '%'"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </card>
                    </pane>
                    
                    <!-- 帮助 -->
                    <pane id="helpPane" icon="help.png" :descs="['helpPane_desc']">
                        <card id="help1" :descs="['help1_desc1']" checked="true" />
                        <card id="help2" :descs="['help2_desc1', 'help2_desc2']" checked="true" />
                        <card id="help3" :descs="['help3_desc1']" checked="true" />
                        <card id="help4" :descs="['help4_desc1']" checked="true" />
                    </pane>
                    
                    <!-- 设置 -->
                    <pane id="settingsPane" icon="cog.png" :descs="['settingsPane_desc']">
                        <card id="companyName" checked="true">
                            <div class="col-12">
                                <div class="row g-1">
                                    <div class="col">
                                        <input type="text" class="form-control" v-model="newCompanyName" />
                                    </div>
                                    <div class="col-auto">
                                        <button class="btn" @click="setCompanyName(newCompanyName)">{{ $t('change') }}</button>
                                    </div>
                                </div>
                            </div>
                        </card>
                        <card id="importExport" checked="true">
                            <div class="col-12">
                                <div class="row g-1">
                                    <div class="col-auto">
                                        <button class="btn" @click="exportData()">{{ $t('export') }}</button>
                                    </div>
                                    <div class="col-auto">
                                        <button class="btn" @click="importData()">{{ $t('import') }}</button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12">
                                <textarea class="form-control" style="height:100px;" v-model="compressed"></textarea>
                            </div>
                            <div class="col-12 small">
                                <span>{{ $t('importExport_desc') }}</span>
                            </div>
                        </card>
                        <card id="notifications" checked="true">
                            <div class="col-12">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="checkHideLocked" v-model="showLockedItems" @click="setDisplayLockedItems(!showLockedItems)" />
                                    <label class="form-check-label small" for="checkHideLocked">{{ $t('showLockedItems') }}</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="checkToastAutoSave" v-model="showToastAutoSave" @click="setNotifAutoSave(!showToastAutoSave)" />
                                    <label class="form-check-label small" for="checkToastAutoSave">{{ $t('showToastAutoSave') }}</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="checkToastAchievement" v-model="showToastAchievement" @click="setNotifAchievement(!showToastAchievement)" />
                                    <label class="form-check-label small" for="checkToastAchievement">{{ $t('showToastAchievement') }}</label>
                                </div>
                            </div>
                        </card>
                        <card id="saving" checked="true">
                            <div class="col-12">
                                <div class="mb-1">
                                    <small>{{ $t('autoSavingDuration') }}</small>
                                </div>
                                <div>
                                    <select class="form-control" v-model="autoSavingDuration" @change="setAutoSaveInterval(autoSavingDuration)">
                                        <option value="30">{{ $t('30seconds') }}</option>
                                        <option value="120">{{ $t('2minutes') }}</option>
                                        <option value="600">{{ $t('10minutes') }}</option>
                                        <option value="-1">{{ $t('off') }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="mb-1">
                                    <small>{{ $t('manualSaving') }}</small>
                                </div>
                                <div class="row g-1">
                                    <div class="col-auto">
                                        <button class="btn" @click="onSave()">
                                            {{ $t('save') }}
                                        </button>
                                    </div>
                                    <div class="col text-end">
                                        <button class="btn btn-danger" @click="hardResetModal.show();">
                                            <span class="text-danger">{{ $t('hardReset') }}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </card>
                    </pane>
                    
                    <!-- 关于 -->
                    <pane id="aboutPane" icon="about.png" :descs="['aboutPane_desc']">
                        <card id="about1" :descs="['about1_desc1']" checked="true">
                            <div class="col-12 small">
                                <ul class="mb-2">
                                    <li class="text-truncate">
                                        <span class="text-light me-2">NG Site</span>
                                        <a href="https://ngspacecompany.exileng.com/">https://ngspacecompany.exileng.com/</a>
                                    </li>
                                    <li class="text-truncate">
                                        <span class="text-light me-2">NG Github</span>
                                        <a href="https://github.com/ExileNG/NGSpaceCompany" target="_blank">https://github.com/ExileNG/NGSpaceCompany</a>
                                    </li>
                                    <li class="text-truncate">
                                        <span class="text-light me-2">NG Discord</span>
                                        <a href="https://discord.gg/3UkgeeT9CV" target="_blank">https://discord.gg/3UkgeeT9CV</a>
                                    </li>
                                </ul>
                                <ul class="mb-0">
                                    <li class="text-truncate">
                                        <span class="text-light me-2">Original Site</span>
                                        <a href="https://sparticle999.github.io/spacecompany" target="_blank">https://sparticle999.github.io/spacecompany</a>
                                    </li>
                                    <li class="text-truncate">
                                        <span class="text-light me-2">Original Github</span>
                                        <a href="https://github.com/sparticle999/SpaceCompany" target="_blank">https://github.com/sparticle999/SpaceCompany</a>
                                    </li>
                                    <li class="text-truncate">
                                        <span class="text-light me-2">Original Discord</span>
                                        <a href="https://discord.gg/hgRUjVp" target="_blank">https://discord.gg/hgRUjVp</a>
                                    </li>
                                </ul>
                            </div>
                        </card>
                        <card id="about2" checked="true">
                            <div class="col-12">
                                <div class="row gy-1 gx-3">
                                    <div class="col-auto"><small class="text-timer">darklord192</small></div>
                                    <div class="col-auto"><small class="text-timer">freeed</small></div>
                                    <div class="col-auto"><small class="text-timer">Daffson</small></div>
                                    <div class="col-auto"><small class="text-timer">PeterO</small></div>
                                    <div class="col-auto"><small class="text-timer">Tamash</small></div>
                                </div>
                            </div>
                        </card>
                        <card id="about3" checked="true">
                            <div class="col-12 small">{{ $t('about3_desc1') }} <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
                            <div class="col-12 small">
                                <ul class="mb-0">
                                    <li>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a></li>
                                </ul>
                            </div>
                        </card>
                    </pane>
                    
                    <!-- 排行 -->
                    <pane id="rankPane" icon="rank.png" :descs="['jingjiePane_desc']">
                        <card id="account" :checked="token != null">
                            <div v-if="token" class="col-12">
                                <div class="row gx-3 gy-2 align-items-center">
                                    <div class="col-12 col-md-auto small">
                                        <span>{{ $t('connected') }} <span class="text-light">{{ username }}</span></span>
                                    </div>
                                    <div class="col-12 col-md-auto text-end">
                                        <button class="btn" @click="onDisconnect()">{{ $t('disconnect') }}</button>
                                    </div>
                                </div>
                            </div>
                            <div v-if="!token" class="col-12">
                                <div class="row gx-3 gy-2 align-items-end">
                                    <div class="col-12 small">
                                        <span>{{ $t('account_desc') }}</span>
                                    </div>
                                    <div class="col-12 col-md-auto">
                                        <small>{{ $t('login') }}</small>
                                        <input type="text" class="form-control" v-model="login" />
                                    </div>
                                    <div class="col-12 col-md-auto">
                                        <small>{{ $t('password') }}</small>
                                        <input type="password" class="form-control" v-model="password" />
                                    </div>
                                    <div class="col-12 col-md-auto text-end">
                                        <button class="btn" @click="onConnect(login, password)">{{ $t('connect') }}</button>
                                    </div>
                                </div>
                            </div>
                        </card>
                        <card v-if="!leaderboard_ranks" :descs="['rankPane_nodata']">
                        </card>
                        <card v-if="leaderboard_ranks" :checked="token != null">
                            <div class="row g-1">
                                <div v-for="(item, index) in leaderboard_ranks" :key="item.user_id" class="col-12 col-md-4">
                                    <div class="btn text-start w-100" :class="{ 'border-success':item.username==username }">
                                        <div class="row g-0">
                                            <div class="col-12">
                                                <span class="text-light d-inline w-100 text-truncate">{{ index + 1 }}</span>
                                            </div>
                                            <div class="col-12">
                                                <span class="h6 text-light d-inline w-100 text-truncate">{{ item.username }}</span>
                                            </div>
                                            <div class="col-12">
                                                <span class="text-normal d-inline w-100 text-truncate">{{ $t('rank_' + item.level) }} ({{ item.level }})</span>
                                            </div>
                                            <div class="col-12 small text-end">
                                                <span class="text-muted">{{ item.remaining }}</span>
                                                <i class="fas fa-fw fa-long-arrow-alt-right text-muted"></i>
                                                <span class="text-muted">{{ item.level + 1 }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </card>
                    </pane>

                </div>
            </inner-content>
        </div>
        <div class="toast-container position-fixed bottom-0 end-0 me-2">
            
            <!-- SAVING TOAST -->
            <div id="toastAutoSave" class="toast hide fade bg-info" role="alert">
                <div class="toast-body text-dark">
                    <div><strong>{{ $t('toastAutoSave_title') }}</strong></div>
                    <div class="small">{{ $t('toastAutoSave_text') }}</div>
                </div>
            </div>
            
            <!-- ACHIEVEMENT TOAST -->
            <div id="toastAchievement" class="toast hide fade bg-success cursor-hover" @click="setActivePane('achievementPane')" role="alert">
                <div class="toast-body text-light">
                    <div><strong>{{ $t('toastAchievement_title') }}</strong></div>
                    <div class="small">{{ $t('toastAchievement_text') }}</div>
                </div>
            </div>
            
            <!-- SPY TOAST -->
            <div id="toastSpySuccess" class="toast hide fade bg-success" role="alert">
                <div class="toast-body text-light">
                    <div><strong>{{ $t('toastSpySuccess_title') }}</strong></div>
                    <div class="small">{{ $t('toastSpySuccess_text') }}</div>
                </div>
            </div>
            <div id="toastSpyFailed" class="toast hide fade bg-danger" role="alert">
                <div class="toast-body text-light">
                    <div><strong>{{ $t('toastSpyFailed_title') }}</strong></div>
                    <div class="small">{{ $t('toastSpyFailed_text') }}</div>
                </div>
            </div>
            
            <!-- INVADE TOAST -->
            <div id="toastInvadeSuccess" class="toast hide fade bg-success" role="alert">
                <div class="toast-body text-light">
                    <div><strong>{{ $t('toastInvadeSuccess_title') }}</strong></div>
                    <div class="small">{{ $t('toastInvadeSuccess_text') }}</div>
                </div>
            </div>
            <div id="toastInvadeFailed" class="toast hide fade bg-danger" role="alert">
                <div class="toast-body text-light">
                    <div><strong>{{ $t('toastInvadeFailed_title') }}</strong></div>
                    <div class="small">{{ $t('toastInvadeFailed_text') }}</div>
                </div>
            </div>
            
            <!-- ABSORB TOAST -->
            <div id="toastAbsorbSuccess" class="toast hide fade bg-success" role="alert">
                <div class="toast-body text-light">
                    <div><strong>{{ $t('toastAbsorbSuccess_title') }}</strong></div>
                    <div class="small">{{ $t('toastAbsorbSuccess_text') }}</div>
                </div>
            </div>
            
        </div>
    </div>
    
    <!-- SPY MODAL -->
    <div v-if="loaded" id="spyModal" class="modal fade">
        <div class="modal-dialog" role="dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="row g-2">
                        <div class="col-12">
                            <span class="h6 text-light">{{ $t('spy') }} {{ $t(activeStar) }}</span>
                        </div>
                        <div class="col-12 small">
                            <span class="text-normal">{{ $t('spy_desc') }}</span>
                        </div>
                        <div class="col-12">
                            <div class="row g-2">
                                <div class="col small">
                                    <div class="text-normal">{{ $t('threat') }}</div>
                                    <div class="text-light">{{ $t('threat' + getThreat(activeStar)) }}</div>
                                </div>
                                <div class="col small">
                                    <div class="text-normal">{{ $t('power') }}</div>
                                    <div class="text-light">{{ getStarPower(activeStar) }}</div>
                                </div>
                                <div class="col small">
                                    <div class="text-normal">{{ $t('defense') }}</div>
                                    <div class="text-light">{{ getStarDefense(activeStar) }}</div>
                                </div>
                                <div class="col small">
                                    <div class="text-normal">{{ $t('speed') }}</div>
                                    <div class="text-light">{{ getStarSpeed(activeStar) }}</div>
                                </div>
                                <div class="col small">
                                    <div class="text-normal">{{ $t('chance') }}</div>
                                    <div class="text-light">{{ numeralFormat(getSpyChance(activeStar), '0') }}%</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="row g-2 align-items-center">
                                <div class="col">
                                    <small class="text-normal">{{ $t('diziT1') }}</small>
                                </div>
                                <div class="col-auto">
                                    <span class="text-light">{{ data['diziT1'].active }}</span>
                                    <small class="ms-1 text-normal">/{{ data['diziT1'].count }}</small>
                                </div>
                                <div class="col-auto">
                                    <div class="btn-group">
                                        <button class="btn p-1" @click="setActiveShip({ id:'diziT1', count:1 })">
                                            +
                                        </button>
                                        <button class="btn p-1" @click="setActiveShip({ id:'diziT1', count:'max' })">
                                            ++
                                        </button>
                                    </div>
                                </div>
                                <div class="col-auto">
                                    <div class="btn-group">
                                        <button class="btn p-1" @click="setActiveShip({ id:'diziT1', count:-1 })">
                                            -
                                        </button>
                                        <button class="btn p-1" @click="setActiveShip({ id:'diziT1', count:'none' })">
                                            --
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="row g-2 justify-content-end">
                                <div class="col-auto">
                                    <button class="btn" @click="onSpy()" data-bs-dismiss="modal">
                                        {{ $t('spy') }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- INVADE MODAL -->
    <div v-if="loaded" id="invadeModal" class="modal fade">
        <div class="modal-dialog" role="dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="row g-2">
                        <div class="col-12">
                            <span class="h6 text-light">{{ $t('invade') }} {{ $t(activeStar) }}</span>
                        </div>
                        <div class="col-12 small">
                            <span class="text-normal">{{ $t('invade_desc') }}</span>
                        </div>
                        <div class="col-12">
                            <div class="row g-2">
                                <div class="col small">
                                    <div class="text-normal">{{ $t('threat') }}</div>
                                    <div class="text-light">{{ $t('threat' + getThreat(activeStar)) }}</div>
                                </div>
                                <div class="col small">
                                    <div class="text-normal">{{ $t('power') }}</div>
                                    <div class="text-light">{{ getStarPower(activeStar) }}</div>
                                </div>
                                <div class="col small">
                                    <div class="text-normal">{{ $t('defense') }}</div>
                                    <div class="text-light">{{ getStarDefense(activeStar) }}</div>
                                </div>
                                <div class="col small">
                                    <div class="text-normal">{{ $t('speed') }}</div>
                                    <div class="text-light">{{ getStarSpeed(activeStar) }}</div>
                                </div>
                                <div class="col small">
                                    <div class="text-normal">{{ $t('chance') }}</div>
                                    <div class="text-light">{{ getInvadeChance(activeStar) * 100 }}%</div>
                                </div>
                            </div>
                        </div>
                        <div v-for="shipId in ['diziT1', 'diziT2', 'diziT3', 'diziT4', 'diziT5']" :key="shipId" class="col-12">
                            <div class="row g-2 align-items-center">
                                <div class="col">
                                    <small class="text-normal">{{ $t(shipId) }}</small>
                                </div>
                                <div class="col-auto">
                                    <span class="text-light">{{ data[shipId].active }}</span>
                                    <small class="ms-1 text-normal">/{{ data[shipId].count }}</small>
                                </div>
                                <div class="col-auto">
                                    <div class="btn-group">
                                        <button class="btn p-1" @click="setActiveShip({ id:shipId, count:1 })">
                                            +
                                        </button>
                                        <button class="btn p-1" @click="setActiveShip({ id:shipId, count:'max' })">
                                            ++
                                        </button>
                                    </div>
                                </div>
                                <div class="col-auto">
                                    <div class="btn-group">
                                        <button class="btn p-1" @click="setActiveShip({ id:shipId, count:-1 })">
                                            -
                                        </button>
                                        <button class="btn p-1" @click="setActiveShip({ id:shipId, count:'none' })">
                                            --
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="row g-2 justify-content-end">
                                <div class="col-auto">
                                    <button class="btn" @click="onInvade()" data-bs-dismiss="modal">
                                        {{ $t('invade') }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- ABSORB MODAL -->
    <div v-if="loaded" id="absorbModal" class="modal fade">
        <div class="modal-dialog" role="dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="row g-2">
                        <div class="col-12">
                            <span class="h6 text-light">{{ $t('absorb') }} {{ $t(activeStar) }}</span>
                        </div>
                        <div class="col-12 small">
                            <span class="text-normal">{{ $t('absorb_desc') }}</span>
                        </div>
                        <div class="col-12">
                            <div class="row g-2 justify-content-end">
                                <div class="col-auto">
                                    <button class="btn" @click="onAbsorb()" data-bs-dismiss="modal">
                                        {{ $t('absorb') }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- REBIRTH MODAL -->
    <div v-if="loaded" id="rebirthModal" class="modal fade">
        <div class="modal-dialog" role="dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="row g-2">
                        <div class="col-12">
                            <span class="h6 text-light">{{ $t('rebirth') }}</span>
                        </div>
                        <div class="col-12 small">
                            <span class="text-normal">{{ $t('rebirth_confirm') }}</span>
                        </div>
                        <div class="col-12 text-end">
                            <button class="btn btn-warning" @click="onRebirth()">{{ $t('rebirth') }}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- HARD RESET MODAL -->
    <div v-if="loaded" id="hardResetModal" class="modal fade">
        <div class="modal-dialog modal-dialog-scrollable" role="dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="row g-2">
                        <div class="col-12">
                            <span class="h6 text-light">{{ $t('hardReset') }}</span>
                        </div>
                        <div class="col-12 small">
                            <span class="text-normal">{{ $t('hardReset_confirm') }}</span>
                        </div>
                        <div class="col-12 text-end">
                            <button class="btn btn-danger" @click="onHardReset()"><span class="text-danger">{{ $t('hardReset') }}</span></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- SEGMENT MODAL -->
    <div v-if="loaded" id="segmentModal" class="modal fade">
        <div class="modal-dialog modal-dialog-scrollable" role="dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="row g-2">
                        <div class="col-12">
                            <span class="h6 text-light">{{ $t('segmentModal') }}</span>
                        </div>
                        <div class="col-12">
                            <calc-segment />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- CALC MODAL -->
    <div v-if="loaded" id="calcModal" class="modal fade">
        <div class="modal-dialog modal-dialog-scrollable" role="dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="row g-2">
                        <div class="col-12">
                            <span class="h6 text-light">{{ $t(calcId) }} {{ $t('calcModal') }}</span>
                        </div>
                        <div class="col-12">
                            <calc-building :id="calcId" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- CHANGELOG MODAL -->
    <div v-if="loaded" id="changeLogModal" class="modal fade">
        <div class="modal-dialog modal-dialog-scrollable" role="dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="row g-2">
                        <div class="col-12">
                            <span class="h6 text-light">{{ $t('changeLog') }}</span>
                        </div>
                        <div class="col-12 border-top">
                            <div class="text-light">v1.16.0 - 2021-06-24</div>
                            <ul class="small">
                                <li>FIX: calculator computed values</li>
                                <li>FIX: computed ship costs after scouting and invasion</li>
                                <li>NEW: nanoswarms DM upgrade will be removed for the moment (those who have it keep it until next rebirth)</li>
                            </ul>
                        </div>
                        <div class="col-12 border-top">
                            <div class="text-light">v1.15.0 - 2021-06-24</div>
                            <ul class="small">
                                <li>FIX: 'Battery Efficiency' still doesn't increase battery storage in v1.14.0</li>
                                <li>FIX: reaching 250 resource machines, or reaching 50T produced resources gives negative XP</li>
                                <li>FIX: nanoswarm resource not showing the resource it is on, after refresh</li>
                                <li>FIX: 'Display autosave notifications' not persisting between refreshes</li>
                                <li>NEW: calculator to compute costs and timers to reach achievements on each machine cards</li>
                            </ul>
                        </div>
                        <div class="col-12 border-top">
                            <div class="text-light">v1.14.0 - 2021-06-24</div>
                            <ul class="small">
                                <li>FIX: 'Battery Efficiency' does not actually increase battery stogage</li>
                                <li>FIX: reset faction relationship to DM upgrade after rebirth</li>
                                <li>NEW: display a warning message when there is not enough consumed resource storage to produce</li>
                                <li>NEW: an option to hide or not locked items</li>
                            </ul>
                        </div>
                        <div class="col-12 border-top">
                            <div class="text-light">v1.13.0 - 2021-06-23</div>
                            <ul class="small">
                                <li>FIX: exit game loop when last update is later than now</li>
                                <li>FIX: reflect boosts in machine cards production/consumptions values</li>
                                <li>FIX: display green mark on 'Batteries' menu item instead of 'Energy' menu item</li>
                                <li>NEW: un-collapse all on 'Rebirth'</li>
                                <li>NEW: display real 'Max' amount of plasma/energy to be converted</li>
                                <li>NEW: when card is minimized, display name + current count</li>
                                <li>NEW: manual save button</li>
                            </ul>
                        </div>
                        <div class="col-12 border-top">
                            <div class="text-light">v1.12.0 - 2021-06-22</div>
                            <ul class="small">
                                <li>FIX: 'Auto-EMC' consumption issue fixed</li>
                                <li>NEW: display total production/consumption and balance on each resource pane</li>
                            </ul>
                        </div>
                        <div class="col-12 border-top">
                            <div class="text-light">v1.11.2 - 2021-06-22</div>
                            <ul class="small">
                                <li>FIX: 'Auto-EMC' frequency issue fixed</li>
                                <li>FIX: 'Multi-Buy' description fixed</li>
                            </ul>
                        </div>
                        <div class="col-12 border-top">
                            <div class="text-light">v1.11.0 - 2021-06-22</div>
                            <ul class="small">
                                <li>NEW: Dyson Segment calculator takes into account current resource count to compute timers</li>
                                <li>NEW: add 'Multi-Buy' as Corporation Kitrinos upgrade</li>
                            </ul>
                        </div>
                        <div class="col-12 border-top">
                            <div class="text-light">v1.10.0 - 2021-06-21</div>
                            <ul class="small">
                                <li>NEW: add Dyson Segment calculator</li>
                            </ul>
                        </div>
                        <div class="col-12 border-top">
                            <div class="text-light">v1.9.2 - 2021-06-21</div>
                            <ul class="small">
                                <li>FIX: fixed 'Starting Storage'</li>
                                <li>FIX: fixed 'Storage Discount'</li>
                            </ul>
                        </div>
                        <div class="col-12 border-top">
                            <div class="text-light">v1.9.1 - 2021-06-21</div>
                            <ul class="small">
                                <li>FIX: make all machine cards collaspable</li>
                                <li>FIX: display 'Auto EMC' as unlocked</li>
                            </ul>
                        </div>
                        <div class="col-12 border-top">
                            <div class="text-light">v1.9.0 - 2021-06-21</div>
                            <ul class="small">
                                <li>NEW: add 'Auto EMC' as Prasnian Empire upgrade</li>
                                <li>NEW: display change log modal when you click on current version number on left side top bar</li>
                                <li>NEW: add 'Hard Reset' functionnality in 'Options' pane</li>
                                <li>NEW: save left side menu group collapse state</li>
                                <li>NEW: make machine card collaspable and save collaspe state</li>
                                <li>NEW: new option to activate/dactivate achievement notification</li>
                            </ul>
                        </div>
                        <div class="col-12 border-top">
                            <div class="text-light">v1.8.0 - 2021-06-20</div>
                            <ul class="small">
                                <li>NEW: better displaying of statictics</li>
                                <li>FIX: display "DONE" on "Floor #2" only when all wonders are activated</li>
                                <li>FIX: "Mystery Wonder Construction" unlocks "Floor #2"</li>
                                <li>FIX: left side resource production displaying is rounding as storage</li>
                            </ul>
                        </div>
                        <div class="col-12 border-top">
                            <div class="text-light">v1.7.0 - 2021-06-19</div>
                            <ul class="small">
                                <li>FIX: Make resource boosts multiplicative, rather than additive</li>
                                <li>FIX : Unlock T5 machines only when Wonder Meteorite is activated</li>
                                <li>NEW: better precision in number displaying (4 digits)</li>
                                <li>NEW: current version number displaying on left side top bar</li>
                            </ul>
                        </div>
                        <div class="col-12 border-top">
                            <div class="text-light">v1.6.0 - 2021-06-18</div>
                            <ul class="small">
                                <li>FIX: fix Energy Efficiency boost (again)</li>
                                <li>NEW : remove dependendy between Wonder Station Floor #2 and Dyson Sphere</li>
                                <li>NEW : add statistics in Achievements pane</li>
                            </ul>
                        </div>
                        <div class="col-12 border-top">
                            <div class="text-light">v1.5.0 - 2021-06-18</div>
                            <ul class="small">
                                <li>NEW : add EMC amount selector</li>
                                <li>NEW : change EMC pane displaying</li>
                                <li>NEW : make Wonder Station Floor #2 available only if you have 1 Dyson Sphere at least (for those who already build wonders on floor #2, you don't loose anything, you will recover your wonders after the first Dyson Sphere)</li>
                            </ul>
                        </div>
                        <div class="col-12 border-top">
                            <div class="text-light">v1.4.0 - 2021-06-18</div>
                            <ul class="small">
                                <li>FIX: fix Energy Efficiency boost</li>
                                <li>FIX: fix Science Efficiency boost</li>
                                <li>NEW: change Ranking pane displaying</li>
                                <li>NEW: change Achievements pane displaying</li>
                            </ul>
                        </div>
                        <div class="col-12 border-top">
                            <div class="text-light">v1.3.0 - 2021-06-17</div>
                            <ul class="small">
                                <li>NEW: add backend to save player current rank data and new pane to display player ranks (leaderboard first tentative)</li>
                            </ul>
                        </div>
                        <div class="col-12 border-top">
                            <div class="text-light">v1.2.0 - 2021-06-16</div>
                            <ul class="small">
                                <li>FIX: to unlock "Floor #1" whatever the wonder you decide to achieve first</li>
                                <li>NEW : make site more compatible with screenreaders</li>
                                <li>NEW : display current version number of the game</li>
                                <li>NEW : every hour check latest version on Github and propose to update the game if current version is not up to date</li>
                            </ul>
                        </div>
                        <div class="col-12 border-top">
                            <div class="text-light">v1.1.0 - 2021-06-16</div>
                            <ul class="small">
                                <li>FIX : do not double the consumption for "Upgrade Resource Technology" & "Upgrade Engine Technology"</li>
                                <li>NEW : display timer to tell when item storage will be empty</li>
                                <li>NEW : display item description even when it is done</li>
                                <li>NEW : display different button style when you hover/click on it</li>
                                <li>NEW : make new achievement toast clickable to achivevement pane</li>
                            </ul>
                        </div>
                        <div class="col-12 border-top">
                            <div class="text-light">v1.0.0 - 2021-06-16</div>
                            <ul class="small">
                                <li>Initial release</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>

<script>
import LZString from 'lz-string'

import Header from './components/Header.vue'
import Content from './components/Content.vue'
import SidenavGroup from './components/SidenavGroup.vue'
import SidenavItem from './components/SidenavItem.vue'
import Pane from './components/Pane.vue'
import Card from './components/Card.vue'
import Resource from './components/Resource.vue'
import Buildable from './components/Buildable.vue'
import Emc from './components/Emc.vue'
import Star from './components/Star.vue'
import Fleet from './components/Fleet.vue'
import CalcSegment from './components/CalcSegment.vue'
import CalcBuilding from './components/CalcBuilding.vue'

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

import { Tooltip, Toast, Modal } from 'bootstrap'

import ghApi from './apis/ghApi.js'

import axios from 'axios'
import moment from 'moment'
import { getIcon } from './utils/icons'

export default {
    components: {
        
        'top-header': Header,
        'inner-content': Content,
        'sidenav-group': SidenavGroup,
        'sidenav-item': SidenavItem,
        'pane': Pane,
        'card': Card,
        'resource': Resource,
        'buildable': Buildable,
        'wuhua': Emc,
        'star': Star,
        'fleet': Fleet,
        'calc-segment': CalcSegment,
        'calc-building': CalcBuilding,
    },
    data() {
        return {
        
            loaded: false,
            sidebarOpen: false,
            
            fastInterval: null,
            slowInterval: null,
            ghInterval: null,
            
            tooltips: [],
            
            toastAutoSave: null,
            toastAchievement: null,
            toastSpySuccess: null,
            toastSpyFailed: null,
            toastInvadeSuccess: null,
            toastInvadeFailed: null,
            toastAbsorbSuccess: null,
            
            showToastAutoSave: true,
            showToastAchievement: true,
            showLockedItems: false,
            
            compressed: null,
            newCompanyName: null,
            autoSavingDuration: null,
            
            calcId: 'lingstone',
            activeStar: 'star201',
            
            spyModal: null,
            invadeModal: null,
            absorbModal: null,
            rebirthModal: null,
            changeLogModal: null,
            hardResetModal: null,
            segmentModal: null,
            calcModal: null,
            
            currentRelease: '1.16.0',
            ghLatestRelease: null,
            
            login: null,
            password: null,
            
            leaderboard_ranks: null,
            
            selectedEmcAmount: null,
            selectedAutoEmcInterval: null,
        }
    },
    computed: {
        ...mapState([
        
            'data', 'companyName', 'locale', 'activePane', 'lastUpdateTime', 'autoSaveInterval', 'timeSinceAutoSave', 'rank',
            'resAchievements', 'prodAchievements', 'newAchievement',
            'notifAutoSave', 'notifAchievement', 'displayLockedItems',
            'username', 'token',
            'emcAmount', 'autoEmcInterval', 'timeSinceAutoEmc',
            'stats',
        ]),
        ...mapGetters([
        
            'isNotif', 'hasNotif',
            'getThreat', 'getSpyChance', 'getInvadeChance', 'getStarPower', 'getStarDefense', 'getStarSpeed',
            'getDMWonders', 'getDMSpheres', 'getDMResearches', 'getDMRank', 'getDMSwarms', 'getPotentialDM',
        ]),
    },
    created() {        
        setTimeout(this.start, 1000)
    },
    methods: {
        getIcon,
        ...mapMutations([
        
            'setLocale', 'setActivePane', 'setLastUpdateTime', 'setTimeSinceAutoSave', 'setCompanyName', 'setAutoSaveInterval',
            'setNotifAutoSave', 'setNotifAchievement', 'setDisplayLockedItems', 'setUsername', 'setToken', 'setEmcAmount', 'setTimeSinceAutoEmc', 'setAutoEmcInterval',
        ]),
        ...mapActions([
        
            'initialize', 'load',
            'computeProdValues', 'produceResources', 'updateTimers', 'checkBoosts', 'updateAchievements', 'save',
            'setActiveShip', 'spy', 'invade', 'absorb',
            'rebirth', 'performAutoEmc',
        ]),
        momentFormat(date, fmt) {
            return moment(date).format(fmt)
        },
        changeLocale(lang) {
        
            if (this.$i18n.locale !== lang) {
                this.setLocale(lang)
                this.$i18n.locale = lang
            }
        },
        start() {

            this.initialize()
            this.load()
            
            this.changeLocale(this.locale)
            this.newCompanyName = this.companyName
            this.autoSavingDuration = this.autoSaveInterval / 1000
            this.login = this.username
            this.selectedEmcAmount = this.emcAmount
            this.selectedAutoEmcInterval = this.autoEmcInterval / 1000
            
            this.ghUpdate()
            
            this.fastInterval = setInterval(() => { this.fastUpdate() }, 100)
            this.slowInterval = setInterval(() => { this.slowUpdate() }, 1000)
            this.ghInterval = setInterval(() => { this.ghUpdate() }, 3600000)
            
            this.loaded = true
            
            this.$nextTick(() => {
            
                let element = null
                
                element = document.getElementById('toastAutoSave')
                this.toastAutoSave = new Toast(element)
                this.showToastAutoSave = this.notifAutoSave 
                this.showToastAchievement = this.notifAchievement 
                this.showLockedItems = this.displayLockedItems
                
                element = document.getElementById('toastAchievement')
                this.toastAchievement = new Toast(element)
                
                element = document.getElementById('toastSpySuccess')
                this.toastSpySuccess = new Toast(element)
                
                element = document.getElementById('toastSpyFailed')
                this.toastSpyFailed = new Toast(element)
                
                element = document.getElementById('toastInvadeSuccess')
                this.toastInvadeSuccess = new Toast(element)
                
                element = document.getElementById('toastInvadeFailed')
                this.toastInvadeFailed = new Toast(element)
                
                element = document.getElementById('toastAbsorbSuccess')
                this.toastAbsorbSuccess = new Toast(element)
            
                Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]')).forEach(node => this.tooltips.push(new Tooltip(node)))
                
                element = document.getElementById('spyModal')
                this.spyModal = new Modal(element)

                element = document.getElementById('invadeModal')
                this.invadeModal = new Modal(element)

                element = document.getElementById('absorbModal')
                this.absorbModal = new Modal(element)
                
                element = document.getElementById('rebirthModal')
                this.rebirthModal = new Modal(element)
                
                element = document.getElementById('changeLogModal')
                this.changeLogModal = new Modal(element)
                
                element = document.getElementById('hardResetModal')
                this.hardResetModal = new Modal(element)
                
                element = document.getElementById('segmentModal')
                this.segmentModal = new Modal(element)
                
                element = document.getElementById('calcModal')
                this.calcModal = new Modal(element)
            })
        },
        fastUpdate() {
        
            let currentTime = new Date().getTime()
            let delta = (currentTime - this.lastUpdateTime) / 1000
            if (delta <= 0) {
                this.setLastUpdateTime(currentTime)
                return
            }
            
            this.setLastUpdateTime(currentTime)
            this.setTimeSinceAutoSave(this.timeSinceAutoSave + delta)
            this.setTimeSinceAutoEmc(this.timeSinceAutoEmc + delta)
            
            this.computeProdValues()
            this.produceResources(delta)
            this.updateTimers()
            this.checkBoosts()
            
            let timeLeft = this.autoEmcInterval - (this.timeSinceAutoEmc * 1000)
            if (timeLeft < 100) {
                this.performAutoEmc()
                this.setTimeSinceAutoEmc(0)
            }
        },
        slowUpdate() {
            
            this.updateAchievements()
            if (this.newAchievement == true && this.showToastAchievement == true) this.toastAchievement.show()
            
            let timeLeft = this.autoSaveInterval - (this.timeSinceAutoSave * 1000)
            if (this.autoSaveInterval < 0) timeLeft = 1000
            if (timeLeft < 100) {

                this.save()
                this.setTimeSinceAutoSave(1)
                if (this.showToastAutoSave) this.toastAutoSave.show()
                
                if (this.token) {
                    
                    let data = {
                        rank: this.rank,
                    }
                    axios.post('https://ngspacecompany.exileng.com/api/post/', data, { headers: { 'Authorization': 'Token ' +  this.token }})
                }   
                
                axios.get('https://ngspacecompany.exileng.com/api/ranks/').then((response) => { this.leaderboard_ranks = response.data })
            }            
        },
        ghUpdate() {
        
            ghApi
                .get('/repos/ExileNG/NGSpaceCompany/releases/latest')
                .then((response) => { this.ghLatestRelease = response.data.tag_name })
        },
        exportData() {
            
            let text = JSON.stringify(JSON.parse(localStorage.getItem('ngsave')))
            this.compressed = LZString.compressToBase64(text)
        },
        importData() {

            if (!this.compressed || !this.compressed.trim()) return console.warn('No data to import')
            if (this.compressed.length % 4 !== 0) return console.warn('Data corrupted')

            let text = LZString.decompressFromBase64(this.compressed)
            if (!text) return console.warn('Import failed')
            
            let impdata = JSON.parse(text)
            localStorage.setItem('ngsave', JSON.stringify(impdata))

            window.location.reload()
        },
        onSpy() {
        
            this.spy(this.activeStar).then(result => {
                if (result == true) this.toastSpySuccess.show()
                else this.toastSpyFailed.show()
            })
        },
        onInvade() {
        
            this.invade(this.activeStar).then(result => {
                if (result == true) this.toastInvadeSuccess.show()
                else this.toastInvadeFailed.show()
            })
        },
        onAbsorb() {
        
            this.absorb(this.activeStar).then(result => {
                if (result == true) this.toastAbsorbSuccess.show()
            })
        },
        onRebirth() {
        
            this.loaded = true
            
            this.rebirth().then(result => {
                if (result == true) window.location.reload()
            })
        },
        onRefresh() {
        
            window.location.reload()
        },
        onConnect(login, pwd) {
            
            if (login && login.trim().length > 4 && pwd && pwd.trim().length > 4)
                axios.post('https://ngspacecompany.exileng.com/api/register/', { username:login.trim(), password:pwd.trim() })
                    .then((response) => {
                    
                        this.setUsername(login.trim())
                        this.setToken(response.data.token)
                    })
                    .catch(() => {
                    
                        axios.post('https://ngspacecompany.exileng.com/api/login/', { username:login.trim(), password:pwd.trim() })
                            .then((response) => {
                    
                                this.setUsername(login.trim())
                                this.setToken(response.data.token)
                            })
                            .catch((error) => {
                            
                                console.log(error.response.data)
                            })
                    })
        },
        onDisconnect() {
        
            this.setUsername(null)
            this.setToken(null)
        },
        onHardReset() {
        
            this.loaded = true
            
            localStorage.removeItem('ngsave')
            window.location.reload()
        },
        onSave() {
        
            this.save()
            this.setTimeSinceAutoSave(1)
            if (this.showToastAutoSave) this.toastAutoSave.show()
        },
    },
    beforeUnmount() {
        
        delete this.toastAutoSave
        delete this.toastAchievement
        delete this.toastSpySuccess
        delete this.toastSpyFailed
        delete this.toastInvadeSuccess
        delete this.toastInvadeFailed
        delete this.toastAbsorbSuccess
        
        delete this.tooltips
        
        delete this.spyModal
        delete this.invadeModal
        delete this.absorbModal
        delete this.rebirthModal
        delete this.changeLogModal
        delete this.hardResetModal
        delete this.segmentModal
        delete this.calcModal
        
        clearInterval(this.fastInterval)
        clearInterval(this.slowInterval)
        clearInterval(this.ghInterval)
    },
}
</script>