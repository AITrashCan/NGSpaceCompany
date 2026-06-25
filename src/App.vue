<template>

    <div v-if="!loaded" id="loadScreen">
        <div class="row row-cols-1 g-2 justify-content-center">
            <div class="col text-center"><h1 class="text-light">Rise of Empire</h1></div>
            <div class="col text-center"><span class="icon-emoji-lg">👑</span></div>
            <div class="col text-center"><h5 class="text-light">Reticulating Splines...</h5></div>
        </div>
    </div>

    <div v-if="loaded" id="gameScreen">
        <div id="sidebar" :class="{ 'open':sidebarOpen }" role="navigation">
            <top-header>
            
                <div class="col-auto">
                    <span class="icon-emoji-md">👑</span>
                </div>

                <div class="col text-truncate px-0">
                    <span class="h5 text-light mb-0">{{ companyName }} Company</span>
                </div>
                
                <div class="col-auto px-0">
                    <button class="btn p-1" @click="changeLogModal.show();">
                        <small class="small text-normal">v{{ currentRelease }}</small>
                    </button>
                </div>

                <div class="col-auto d-lg-none">
                    <button @click="sidebarOpen = false;">
                        <i class="fas fa-fw fa-times"></i>
                    </button>
                </div>
                
            </top-header>
            <inner-content data-simplebar>
                <div class="row gx-2 gy-3 row-cols-1">
                
                    <sidenav-group id="vitalityHeading" :unlocked="data['vitality'].unlocked">
                        <sidenav-item id="vitalityPane" icon="vitality.png" :unlocked="data['vitality'].unlocked" :prod="data['vitality'].prod" :problem="data['vitality'].problem" />
                        <sidenav-item id="reservoirPane" icon="reservoir.png" :unlocked="data['vitality'].unlocked" :count="data['vitality'].count" :storage="data['vitality'].storage" />
                    </sidenav-group>
                    
                    <sidenav-group id="arcaneHeading" :unlocked="data['charcoal'].unlocked">
                        <sidenav-item id="dragonFirePane" icon="dragonFire.png" :unlocked="data['dragonFire'].unlocked" :prod="data['dragonFire'].prod" :count="data['dragonFire'].count" :storage="data['dragonFire'].storage" :problem="data['dragonFire'].problem" />
                        <sidenav-item id="starIronPane" icon="starIron.png" :unlocked="data['starIron'].unlocked" :prod="data['starIron'].prod" :count="data['starIron'].count" :storage="data['starIron'].storage" :problem="data['starIron'].problem" />
                        <sidenav-item id="charcoalPane" icon="charcoal.png" :unlocked="data['charcoal'].unlocked" :prod="data['charcoal'].prod" :count="data['charcoal'].count" :storage="data['charcoal'].storage" :problem="data['charcoal'].problem" />
                    </sidenav-group>

                    <sidenav-group id="villageResourcesHeading" :unlocked="data['iron'].unlocked">
                        <sidenav-item id="saltpeterPane" icon="saltpeter.png" :unlocked="data['saltpeter'].unlocked" :prod="data['saltpeter'].prod" :count="data['saltpeter'].count" :storage="data['saltpeter'].storage" />
                        <sidenav-item id="ironPane" icon="iron.png" :unlocked="data['iron'].unlocked" :prod="data['iron'].prod" :count="data['iron'].count" :storage="data['iron'].storage" />
                        <sidenav-item id="jadePane" icon="jade.png" :unlocked="data['jade'].unlocked" :prod="data['jade'].prod" :count="data['jade'].count" :storage="data['jade'].storage" />
                        <sidenav-item id="timberPane" icon="timber.png" :unlocked="data['timber'].unlocked" :prod="data['timber'].prod" :count="data['timber'].count" :storage="data['timber'].storage" />
                        <sidenav-item id="bronzePane" icon="bronze.png" :unlocked="data['bronze'].unlocked" :prod="data['bronze'].prod" :count="data['bronze'].count" :storage="data['bronze'].storage" />
                        <sidenav-item id="cinnabarPane" icon="cinnabar.png" :unlocked="data['cinnabar'].unlocked" :prod="data['cinnabar'].prod" :count="data['cinnabar'].count" :storage="data['cinnabar'].storage" />
                        <sidenav-item id="magmaPane" icon="magma.png" :unlocked="data['magma'].unlocked" :prod="data['magma'].prod" :count="data['magma'].count" :storage="data['magma'].storage" />
                    </sidenav-group>

                    <sidenav-group id="regionalResourcesHeading" :unlocked="data['moonSilver'].unlocked">
                        <sidenav-item id="moonSilverPane" icon="moonSilver.png" :unlocked="data['moonSilver'].unlocked" :prod="data['moonSilver'].prod" :count="data['moonSilver'].count" :storage="data['moonSilver'].storage" />
                        <sidenav-item id="niterPane" icon="niter.png" :unlocked="data['niter'].unlocked" :prod="data['niter'].prod" :count="data['niter'].count" :storage="data['niter'].storage" />
                        <sidenav-item id="darkSteelPane" icon="darkSteel.png" :unlocked="data['darkSteel'].unlocked" :prod="data['darkSteel'].prod" :count="data['darkSteel'].count" :storage="data['darkSteel'].storage" />
                        <sidenav-item id="goldPane" icon="gold.png" :unlocked="data['gold'].unlocked" :prod="data['gold'].prod" :count="data['gold'].count" :storage="data['gold'].storage" />
                        <sidenav-item id="silverPane" icon="silver.png" :unlocked="data['silver'].unlocked" :prod="data['silver'].prod" :count="data['silver'].count" :storage="data['silver'].storage" />
                    </sidenav-group>

                    <sidenav-group id="imperialResourcesHeading" :unlocked="data['spiritVein'].unlocked">
                        <sidenav-item id="spiritVeinPane" icon="spiritVein.png" :unlocked="data['spiritVein'].unlocked" :prod="data['spiritVein'].prod" :count="data['spiritVein'].count" :storage="data['spiritVein'].storage" />
                        <sidenav-item id="voidEssencePane" icon="voidEssence.png" :unlocked="data['voidEssence'].unlocked" :prod="data['voidEssence'].prod" :count="data['voidEssence'].count" :storage="data['voidEssence'].storage" />
                        <sidenav-item id="frostCrystalPane" icon="frostCrystal.png" :unlocked="data['frostCrystal'].unlocked" :prod="data['frostCrystal'].prod" :count="data['frostCrystal'].count" :storage="data['frostCrystal'].storage" />
                    </sidenav-group>

                    <sidenav-group id="scholarshipHeading" :unlocked="data['scholarship'].unlocked">
                        <sidenav-item id="scholarshipPane" icon="scholarship.png" :unlocked="data['scholarship'].unlocked" :prod="data['scholarship'].prod" :count="data['scholarship'].count" />
                        <sidenav-item id="researchPane" icon="research.png" :unlocked="data['scholarship'].unlocked" />
                    </sidenav-group>

                    <sidenav-group id="logisticsHeading" :unlocked="data['warFuel'].unlocked">
                        <sidenav-item id="warFuelPane" icon="warFuel.png" :unlocked="data['warFuel'].unlocked" :prod="data['warFuel'].prod" :count="data['warFuel'].count" />
                        <sidenav-item id="caravanPane" icon="caravan.png" :unlocked="data['caravan1'].unlocked" :done="data['caravan2'].count > 0" doneText="launched" />
                        <sidenav-item id="regionalPane" icon="regional.png" :unlocked="data['frontierMarch'].unlocked" :done="data['legendFortress'].count > 0" doneText="explored" />
                        <sidenav-item id="imperialPane" icon="imperial.png" :unlocked="data['spiritPeaks'].unlocked" :done="data['imperialAcademy1'].count > 0" doneText="explored" />
                    </sidenav-group>

                    <sidenav-group id="legendsHeading" :unlocked="data['legendTreasure0'].unlocked">
                        <sidenav-item id="legendFortressPane" icon="legendFortress.png" :unlocked="data['legendTreasure0'].unlocked" :done="data['legendTreasure0'].count > 0 && data['legendVital0'].count > 0 && data['legendScholar0'].count > 0 && data['legendCelestial0'].count > 0" doneText="done" />
                        <sidenav-item id="legendFloor1Pane" icon="legendFloor1.png" :unlocked="data['legendTreasure1'].unlocked || data['legendVital1'].unlocked || data['legendScholar1'].unlocked || data['legendCelestial1'].unlocked" :done="data['legendTreasure1'].count > 0 && data['legendVital1'].count > 0 && data['legendScholar1'].count > 0 && data['legendCelestial1'].count > 0" doneText="done" />
                        <sidenav-item id="legendFloor2Pane" icon="legendFloor2.png" :unlocked="data['legendBeacon'].unlocked" :done="data['legendBeacon'].count > 0 && data['legendWarship'].count > 0 && data['legendChaosGate'].count > 0 && data['legendPortal'].count > 0" doneText="done" />
                        <sidenav-item id="legendFloor3Pane" icon="legendFloor3.png" :unlocked="data['legendHeavenGate'].unlocked" :done="data['legendHeavenGate'].count > 0" doneText="done" />
                    </sidenav-group>

                    <sidenav-group id="imperialAcademyHeading" :unlocked="data['techDragonFire0'].unlocked">
                        <sidenav-item id="imperialAcademyPane" icon="imperialAcademy.png" :unlocked="data['techDragonFire0'].unlocked" :done="data['techDragonFire0'].count > 0 && data['techAlchemy0'].count > 0 && data['techGrandFormation0'].count > 0" doneText="done" />
                        <sidenav-item id="alchemyPane" icon="alchemy.png" :unlocked="data['alchemy'].unlocked" />
                        <sidenav-item id="grandFormationPane" icon="grandFormation.png" :unlocked="data['formationCore'].unlocked" />
                    </sidenav-group>

                    <sidenav-group id="dominionHeading" :unlocked="data['scoutT1'].unlocked || data['chaosEssence'].unlocked || data['warEngine'].unlocked || data['soldierT1'].unlocked">
                        <sidenav-item id="chaosEssencePane" icon="chaosEssence.png" :unlocked="data['chaosEssence'].unlocked" :prod="data['chaosEssence'].prod" :count="data['chaosEssence'].count" :storage="data['chaosEssence'].storage" />
                        <sidenav-item id="scoutPane" icon="scout.png" :unlocked="data['scoutT1'].unlocked" />
                        <sidenav-item id="warEnginePane" icon="warEngine.png" :unlocked="data['warEngine'].unlocked" :done="data['warEngine'].count > 0" doneText="built" />
                        <sidenav-item id="militaryPane" icon="military.png" :unlocked="data['soldierT1'].unlocked" />
                        <sidenav-item id="dominionCrimsonLotusPane" icon="crimsonLotus.png" :unlocked="data['warEngine'].count > 0" :opinion="data['crimsonLotus'].opinion" />
                        <sidenav-item id="dominionJadeThronePane" icon="jadeThrone.png" :unlocked="data['warEngine'].count > 0" :opinion="data['jadeThrone'].opinion" />
                        <sidenav-item id="dominionAzureAcademyPane" icon="azureAcademy.png" :unlocked="data['warEngine'].count > 0" :opinion="data['azureAcademy'].opinion" />
                        <sidenav-item id="dominionGoldenCartelPane" icon="goldenCartel.png" :unlocked="data['warEngine'].count > 0" :opinion="data['goldenCartel'].opinion" />
                        <sidenav-item id="dominionIronLegionPane" icon="ironLegion.png" :unlocked="data['warEngine'].count > 0" :opinion="data['ironLegion'].opinion" />
                    </sidenav-group>

                    <sidenav-group id="mandateHeading" :unlocked="data['mandate'].unlocked">
                        <sidenav-item id="mandatePane" icon="mandate.png" :unlocked="data['mandate'].unlocked" :count="data['mandate'].count" :potential="getPotentialDM" />
                        <sidenav-item id="mandateCrimsonLotusPane" icon="crimsonLotus.png" :unlocked="data['mandate'].unlocked" :opinion="data['crimsonLotus'].opinion" />
                        <sidenav-item id="mandateJadeThronePane" icon="jadeThrone.png" :unlocked="data['mandate'].unlocked" :opinion="data['jadeThrone'].opinion" />
                        <sidenav-item id="mandateAzureAcademyPane" icon="azureAcademy.png" :unlocked="data['mandate'].unlocked" :opinion="data['azureAcademy'].opinion" />
                        <sidenav-item id="mandateGoldenCartelPane" icon="goldenCartel.png" :unlocked="data['mandate'].unlocked" :opinion="data['goldenCartel'].opinion" />
                        <sidenav-item id="mandateIronLegionPane" icon="ironLegion.png" :unlocked="data['mandate'].unlocked" :opinion="data['ironLegion'].opinion" />
                        <sidenav-item id="mandateCelestialWillPane" icon="celestialWill.png" :unlocked="data['mandate'].unlocked" :opinion="data['celestialWill'].opinion" />
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
                        <span class="icon-emoji-md">👑</span>
                    </button>
                </div>
                
                <div class="col-auto ms-auto">
                    <a href="https://discord.gg/3UkgeeT9CV" target="_blank" data-bs-toggle="tooltip" data-bs-placement="left" title="Discord">
                        <span class="icon-emoji-md">{{ UI_EMOJI.discord }}</span>
                    </a>
                </div>
                
                <div class="col-auto cursor-hover">
                    <button @click="setActivePane('donatingPane')">
                        <span class="icon-emoji-md">{{ UI_EMOJI.donating }}</span>
                        <span class="ms-1 text-light">{{ $t('donatingPane') }}</span>
                    </button>
                </div>
                
                <div class="col-auto cursor-hover position-relative" data-bs-toggle="tooltip" data-bs-placement="left" :title="$t('achievementPane')">
                    <button @click="setActivePane('achievementPane')">
                        <div v-if="isNotif('achievementPane')" class="position-absolute top-0 end-0" style="line-height:1">
                            <i class="fas fa-fw fa-certificate text-success small"></i>
                        </div>
                        <span class="icon-emoji-md">{{ UI_EMOJI.trophy }}</span>
                    </button>
                </div>
                
                <div class="col-auto cursor-hover position-relative" data-bs-toggle="tooltip" data-bs-placement="left" :title="$t('rankPane')">
                    <button @click="setActivePane('rankPane')">
                        <span class="icon-emoji-md">{{ UI_EMOJI.rank }}</span>
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
                        <li>
                            <button class="dropdown-item cursor-hover" @click="changeLocale('zh')">
                                <span class="flag-icon flag-icon-cn rounded me-2"></span>
                                中文
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
                                <span class="icon-emoji-md me-2">{{ UI_EMOJI.help }}</span>
                                {{ $t('helpPane') }}
                            </button>
                        </li>
                        <li>
                            <button class="dropdown-item cursor-hover" @click="setActivePane('settingsPane')">
                                <span class="icon-emoji-md me-2">{{ UI_EMOJI.cog }}</span>
                                {{ $t('settingsPane') }}
                            </button>
                        </li>
                        <li>
                            <button class="dropdown-item cursor-hover" @click="setActivePane('aboutPane')">
                                <span class="icon-emoji-md me-2">{{ UI_EMOJI.about }}</span>
                                {{ $t('aboutPane') }}
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
                    
                    <!-- ENERGY PANE -->
                    <pane id="vitalityPane" icon="vitality.png" :descs="['vitalityPane_desc']">
                        <resource id="vitality" />
                        <buildable id="vitalityT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="vitalityT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techVitality2" />
                        <buildable id="vitalityT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="fertileValley" />
                        <buildable id="vitalityT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendTreasure1" />
                        <buildable id="vitalityT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendVital1" />
                        <buildable id="vitalityT6" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="spiritPeaks" />
                    </pane>
                    
                    <!-- BATTERY PANE -->
                    <pane id="reservoirPane" icon="reservoir.png" :descs="['reservoirPane_desc']">
                        <buildable id="vitalityS1" btnText="build" collapse="true" unlocker="techVitalityStorage1" />
                        <buildable id="vitalityS2" btnText="build" collapse="true" unlocker="techVitalityStorage2" />
                        <buildable id="vitalityS3" btnText="build" collapse="true" unlocker="techVitalityStorage3" />
                        <buildable id="vitalityS4" btnText="build" collapse="true" unlocker="techVitalityStorage4" />
                        <buildable id="vitalityS5" btnText="build" collapse="true" unlocker="techVitalityStorage5" />
                        <buildable id="vitalityS6" btnText="build" collapse="true" unlocker="techVitalityStorage6" />
                    </pane>
                    
                    <!-- PLASMA PANE -->
                    <pane id="dragonFirePane" icon="dragonFire.png" :descs="['dragonFirePane_desc']">
                        <resource id="dragonFire" />
                        <buildable id="dragonFireT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techDragonFire1" />
                        <buildable id="dragonFireT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techDragonFire2" />
                        <buildable id="dragonFireT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techDragonFire3" />
                        <buildable id="dragonFireT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techDragonFire4" />
                        <buildable id="dragonFireS1" btnText="build" collapse="true" unlocker="techDragonFireStorage1" />
                        <buildable id="dragonFireS2" btnText="build" collapse="true" unlocker="techDragonFireStorage2" />
                        <buildable id="dragonFireS3" btnText="build" collapse="true" unlocker="techDragonFireStorage3" />
                    </pane>
                    
                    <!-- METEORITE PANE -->
                    <pane id="starIronPane" icon="starIron.png" :descs="['starIronPane_desc']">
                        <resource id="starIron" />
                        <buildable id="starIronS1" btnText="upgrade" collapse="true" />
                        <buildable id="starIronT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techStarIron1" />
                        <buildable id="starIronT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techStarIron2" />
                        <buildable id="starIronT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techStarIron3" />
                        <buildable id="starIronT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techStarIron4" />
                    </pane>
                    
                    <!-- CARBON PANE -->
                    <pane id="charcoalPane" icon="charcoal.png" :descs="['charcoalPane_desc']">
                        <resource id="charcoal" />
                        <buildable id="charcoalS1" btnText="upgrade" collapse="true" unlocker="techStorehouse" />
                        <buildable id="charcoalT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="charcoalT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier2" />
                        <buildable id="charcoalT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendScholar1" />
                        <buildable id="charcoalT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendCelestial1" />
                        <buildable id="charcoalT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier5" />
                    </pane>
                    
                    <!-- OIL PANE -->
                    <pane id="saltpeterPane" icon="saltpeter.png" :descs="['saltpeterPane_desc']">
                        <resource id="saltpeter" />
                        <buildable id="saltpeterS1" btnText="upgrade" collapse="true" unlocker="techStorehouse" />
                        <buildable id="saltpeterT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="saltpeterT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier2" />
                        <buildable id="saltpeterT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendScholar1" />
                        <buildable id="saltpeterT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendCelestial1" />
                        <buildable id="saltpeterT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier5" />
                    </pane>
                    
                    <!-- METAL PANE -->
                    <pane id="ironPane" icon="iron.png" :descs="['ironPane_desc']">
                        <resource id="iron" />
                        <buildable id="ironS1" btnText="upgrade" collapse="true" unlocker="techStorehouse" />
                        <buildable id="ironT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="ironT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier2" />
                        <buildable id="ironT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendScholar1" />
                        <buildable id="ironT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendCelestial1" />
                        <buildable id="ironT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier5" />
                    </pane>
                    
                    <!-- GEM PANE -->
                    <pane id="jadePane" icon="jade.png" :descs="['jadePane_desc']">
                        <resource id="jade" />
                        <buildable id="jadeS1" btnText="upgrade" collapse="true" unlocker="techStorehouse" />
                        <buildable id="jadeT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="jadeT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier2" />
                        <buildable id="jadeT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendScholar1" />
                        <buildable id="jadeT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendCelestial1" />
                        <buildable id="jadeT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier5" />
                    </pane>
                    
                    <!-- WOOD PANE -->
                    <pane id="timberPane" icon="timber.png" :descs="['timberPane_desc']">
                        <resource id="timber" />
                        <buildable id="timberS1" btnText="upgrade" collapse="true" unlocker="techStorehouse" />
                        <buildable id="timberT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="timberT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier2" />
                        <buildable id="timberT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendScholar1" />
                        <buildable id="timberT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendCelestial1" />
                        <buildable id="timberT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier5" />
                    </pane>
                    
                    <!-- SILICON PANE -->
                    <pane id="bronzePane" icon="bronze.png" :descs="['bronzePane_desc']">
                        <resource id="bronze" />
                        <buildable id="bronzeS1" btnText="upgrade" collapse="true" unlocker="techStorehouse" />
                        <buildable id="bronzeT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="bronzeT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier2" />
                        <buildable id="bronzeT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendScholar1" />
                        <buildable id="bronzeT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendCelestial1" />
                        <buildable id="bronzeT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier5" />
                    </pane>
                    
                    <!-- URANIUM PANE -->
                    <pane id="cinnabarPane" icon="cinnabar.png" :descs="['cinnabarPane_desc']">
                        <resource id="cinnabar" />
                        <buildable id="cinnabarS1" btnText="upgrade" collapse="true" unlocker="techStorehouse" />
                        <buildable id="cinnabarT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="cinnabarT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier2" />
                        <buildable id="cinnabarT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendScholar1" />
                        <buildable id="cinnabarT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendCelestial1" />
                        <buildable id="cinnabarT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier5" />
                    </pane>
                    
                    <!-- LAVA PANE -->
                    <pane id="magmaPane" icon="magma.png" :descs="['magmaPane_desc']">
                        <resource id="magma" />
                        <buildable id="magmaS1" btnText="upgrade" collapse="true" unlocker="techStorehouse" />
                        <buildable id="magmaT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="magmaT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier2" />
                        <buildable id="magmaT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendScholar1" />
                        <buildable id="magmaT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendCelestial1" />
                        <buildable id="magmaT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier5" />
                    </pane>
                    
                    <!-- LUNARITE PANE -->
                    <pane id="moonSilverPane" icon="moonSilver.png" :descs="['moonSilverPane_desc']">
                        <resource id="moonSilver" />
                        <buildable id="moonSilverS1" btnText="upgrade" collapse="true" unlocker="techStorehouse" />
                        <buildable id="moonSilverT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="moonSilverT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier2" />
                        <buildable id="moonSilverT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendScholar1" />
                        <buildable id="moonSilverT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendCelestial1" />
                        <buildable id="moonSilverT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier5" />
                    </pane>
                    
                    <!-- METHANE PANE -->
                    <pane id="niterPane" icon="niter.png" :descs="['niterPane_desc']">
                        <resource id="niter" />
                        <buildable id="niterS1" btnText="upgrade" collapse="true" unlocker="techStorehouse" />
                        <buildable id="niterT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="niterT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier2" />
                        <buildable id="niterT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendScholar1" />
                        <buildable id="niterT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendCelestial1" />
                        <buildable id="niterT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier5" />
                    </pane>
                    
                    <!-- TITANIUM PANE -->
                    <pane id="darkSteelPane" icon="darkSteel.png" :descs="['darkSteelPane_desc']">
                        <resource id="darkSteel" />
                        <buildable id="darkSteelS1" btnText="upgrade" collapse="true" unlocker="techStorehouse" />
                        <buildable id="darkSteelT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="darkSteelT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier2" />
                        <buildable id="darkSteelT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendScholar1" />
                        <buildable id="darkSteelT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendCelestial1" />
                        <buildable id="darkSteelT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier5" />
                    </pane>
                    
                    <!-- GOLD PANE -->
                    <pane id="goldPane" icon="gold.png" :descs="['goldPane_desc']">
                        <resource id="gold" />
                        <buildable id="goldS1" btnText="upgrade" collapse="true" unlocker="techStorehouse" />
                        <buildable id="goldT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="goldT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier2" />
                        <buildable id="goldT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendScholar1" />
                        <buildable id="goldT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendCelestial1" />
                        <buildable id="goldT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier5" />
                    </pane>
                    
                    <!-- SILVER PANE -->
                    <pane id="silverPane" icon="silver.png" :descs="['silverPane_desc']">
                        <resource id="silver" />
                        <buildable id="silverS1" btnText="upgrade" collapse="true" unlocker="techStorehouse" />
                        <buildable id="silverT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="silverT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier2" />
                        <buildable id="silverT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendScholar1" />
                        <buildable id="silverT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendCelestial1" />
                        <buildable id="silverT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier5" />
                    </pane>
                    
                    <!-- HYDROGEN PANE -->
                    <pane id="spiritVeinPane" icon="spiritVein.png" :descs="['spiritVeinPane_desc']">
                        <resource id="spiritVein" />
                        <buildable id="spiritVeinS1" btnText="upgrade" collapse="true" unlocker="techStorehouse" />
                        <buildable id="spiritVeinT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="spiritVeinT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier2" />
                        <buildable id="spiritVeinT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendScholar1" />
                        <buildable id="spiritVeinT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendCelestial1" />
                        <buildable id="spiritVeinT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier5" />
                    </pane>
                    
                    <!-- HELIUM PANE -->
                    <pane id="voidEssencePane" icon="voidEssence.png" :descs="['voidEssencePane_desc']">
                        <resource id="voidEssence" />
                        <buildable id="voidEssenceS1" btnText="upgrade" collapse="true" unlocker="techStorehouse" />
                        <buildable id="voidEssenceT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="voidEssenceT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier2" />
                        <buildable id="voidEssenceT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendScholar1" />
                        <buildable id="voidEssenceT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendCelestial1" />
                        <buildable id="voidEssenceT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier5" />
                    </pane>
                    
                    <!-- ICE PANE -->
                    <pane id="frostCrystalPane" icon="frostCrystal.png" :descs="['frostCrystalPane_desc']">
                        <resource id="frostCrystal" />
                        <buildable id="frostCrystalS1" btnText="upgrade" collapse="true" unlocker="techStorehouse" />
                        <buildable id="frostCrystalT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="frostCrystalT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier2" />
                        <buildable id="frostCrystalT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendScholar1" />
                        <buildable id="frostCrystalT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="legendCelestial1" />
                        <buildable id="frostCrystalT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techTier5" />
                    </pane>
                    
                    <!-- SCIENCE PANE -->
                    <pane id="scholarshipPane" icon="scholarship.png" :descs="['scholarshipPane_desc']">
                        <buildable id="scholarsoldierT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="scholarsoldierT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techScholarship2" />
                        <buildable id="scholarsoldierT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techScholarship3" />
                        <buildable id="scholarsoldierT4" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techScholarship4" />
                        <buildable id="scholarsoldierT5" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techScholarship5" />
                    </pane>
                    
                    <!-- TECHNOLOGIES PANE -->
                    <pane id="researchPane" icon="research.png" :descs="['researchPane_desc']">
                        <buildable id="techStorehouse" btnText="unlock" />
                        <buildable id="techVitality1" btnText="unlock" />
                        <buildable id="techSaltpeter" btnText="unlock" unlocker="techStorehouse" />
                        <buildable id="techVitality2" btnText="unlock" unlocker="techVitality1" />
                        <buildable id="techTier2" btnText="unlock" unlocker="techVitality1" />
                        <buildable id="techDecommission" btnText="unlock" unlocker="techTier2" />
                        <buildable id="techWarFuel1" btnText="unlock" unlocker="techTier2" />
                        <buildable id="techWarFuel2" btnText="unlock" unlocker="techWarFuel1" />
                        <buildable id="techWarFuel3" btnText="unlock" unlocker="techWarFuel2" />
                        <buildable id="techScholarship2" btnText="unlock" unlocker="techWarFuel1" />
                        <buildable id="techScholarship3" btnText="unlock" unlocker="techScholarship2" />
                        <buildable id="techScholarship4" btnText="unlock" unlocker="techScholarship3" />
                        <buildable id="techVitalityStorage1" btnText="unlock" unlocker="upgradeVitality2" />
                        <buildable id="techVitalityStorage2" btnText="unlock" unlocker="techVitalityStorage1" />
                        <buildable id="techVitalityStorage3" btnText="unlock" unlocker="techVitalityStorage2" />
                        <buildable id="techVitalityStorage4" btnText="unlock" unlocker="techVitalityStorage4" />
                        <buildable id="techDragonFire1" btnText="unlock" unlocker="techDragonFire0" />
                        <buildable id="techDragonFire2" btnText="unlock" unlocker="techDragonFire1" />
                        <buildable id="techDragonFireStorage1" btnText="unlock" unlocker="techDragonFire1" />
                        <buildable id="techDragonFireStorage2" btnText="unlock" unlocker="techDragonFireStorage1" />
                        <buildable id="techAlchemy1" btnText="unlock" unlocker="techAlchemy0" />
                        <buildable id="techStarIron0" btnText="unlock" unlocker="techAlchemy1" />
                        <buildable id="techStarIron1" btnText="unlock" unlocker="legendCelestial1" />
                        <buildable id="techStarIron2" btnText="unlock" unlocker="techStarIron1" />
                        <buildable id="techGrandFormation1" btnText="unlock" unlocker="techGrandFormation0" />
                        <buildable id="techGrandFormation2" btnText="unlock" unlocker="techGrandFormation1" />
                        <buildable id="techShadowNetwork1" btnText="unlock" unlocker="techShadowNetwork0" />
                        <buildable id="upgradeTier2" btnText="upgrade" unlocker="techTier2" />
                        <buildable id="upgradeVitality1" btnText="upgrade" unlocker="techVitality1" />
                        <buildable id="upgradeVitality2" btnText="upgrade" unlocker="techVitality2" />
                        <buildable id="boostProduction" btnText="boost" />
                        <buildable id="boostScholarship" btnText="boost" />
                        <buildable id="boostVitality" btnText="boost" />
                        <buildable id="boostVitalityStorage" btnText="boost" />
                    </pane>
                    
                    <!-- FUEL PANE -->
                    <pane id="warFuelPane" icon="warFuel.png" :descs="['warFuelPane_desc']">
                        <resource id="warFuel" />
                        <buildable id="warFuelT1" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" />
                        <buildable id="warFuelT2" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techWarFuel2" />
                        <buildable id="warFuelT3" btnText="build" collapse="true" :multibuy="data['multiBuy'].count > 0" calc="true" unlocker="techWarFuel3" />
                    </pane>
                    
                    <!-- ROCKET PANE -->
                    <pane id="caravanPane" icon="caravan.png" :descs="['caravanPane_desc']">
                        <buildable id="caravan1" btnText="build" />
                        <buildable id="caravan2" btnText="launch" unlocker="caravan1" />
                    </pane>
                    
                    <!-- INNER SOLAR SYSTEM PANE -->
                    <pane id="regionalPane" icon="regional.png">
                        <buildable id="frontierMarch" btnText="explore" />
                        <buildable id="barrenReach" btnText="explore" />
                        <buildable id="fertileValley" btnText="explore" />
                        <buildable id="ironSteppe" btnText="explore" />
                        <buildable id="goldRidge" btnText="explore" />
                        <buildable id="legendFortress" btnText="explore" unlocker="goldRidge" />
                    </pane>

                    <!-- OUTER SOLAR SYSTEM PANE -->
                    <pane id="imperialPane" icon="imperial.png">
                        <buildable id="spiritPeaks" btnText="explore" />
                        <buildable id="cloudRealm" btnText="explore" />
                        <buildable id="silentExpanse" btnText="explore" />
                        <buildable id="deepAbyss" btnText="explore" />
                        <buildable id="frozenWastes" btnText="explore" />
                        <buildable id="imperialAcademy0" btnText="explore" unlocker="frozenWastes" />
                        <buildable id="imperialAcademy1" btnText="explore" unlocker="imperialAcademy0" />
                    </pane>

                    <!-- WONDER STATION PANE -->
                    <pane id="legendFortressPane" icon="legendFortress.png" :descs="['legendFortressPane_desc']">
                        <buildable id="legendTreasure0" btnText="build" />
                        <buildable id="legendVital0" btnText="build" />
                        <buildable id="legendScholar0" btnText="build" />
                        <buildable id="legendCelestial0" btnText="build" />
                    </pane>

                    <!-- FLOOR #1 PANE -->
                    <pane id="legendFloor1Pane" icon="legendFloor1.png">
                        <buildable id="legendTreasure1" btnText="activate" />
                        <buildable id="legendVital1" btnText="activate" />
                        <buildable id="legendScholar1" btnText="activate" />
                        <buildable id="legendCelestial1" btnText="activate" />
                    </pane>

                    <!-- FLOOR #2 PANE -->
                    <pane id="legendFloor2Pane" icon="legendFloor2.png">
                        <buildable id="legendBeacon" btnText="activate" />
                        <buildable id="legendWarship" btnText="activate" />
                        <buildable id="legendChaosGate" btnText="activate" />
                        <buildable id="legendPortal" btnText="activate" />
                    </pane>

                    <!-- FLOOR #3 PANE -->
                    <pane id="legendFloor3Pane" icon="legendFloor3.png">
                        <buildable id="legendHeavenGate" btnText="activate" />
                    </pane>
                    
                    <!-- SOL CENTER PANE -->
                    <pane id="imperialAcademyPane" icon="imperialAcademy.png">
                        <buildable id="techDragonFire0" btnText="unlock" />
                        <buildable id="techAlchemy0" btnText="unlock" />
                        <buildable id="techGrandFormation0" btnText="unlock" />
                    </pane>
                    
                    <!-- EMC PANE -->
                    <pane id="alchemyPane" icon="alchemy.png" :descs="['alchemyPane_desc']">
                        <card checked="true">
                            <div class="col-12">
                                <div class="row gx-3">
                                    <div class="col">
                                        <div class="small">{{ $t('selectAlchemyAmount') }}</div>
                                        <select class="form-control" v-model="selectedAlchemyAmount" @change="setAlchemyAmount(selectedAlchemyAmount)">
                                            <option value="max">Max</option>
                                            <option value="1">1</option>
                                            <option value="10">10</option>
                                            <option value="100">100</option>
                                            <option value="1000">{{ numeralFormat(1000, '0a') }}</option>
                                            <option value="10000">{{ numeralFormat(10000, '0a') }}</option>
                                            <option value="100000">{{ numeralFormat(100000, '0a') }}</option>
                                        </select>
                                    </div>
                                    <div v-if="data['autoAlchemy'].count > 0" class="col">
                                        <div class="small">{{ $t('selectAutoAlchemyInterval') }}</div>
                                        <select class="form-control" v-model="selectedAutoAlchemyInterval" @change="setAutoAlchemyInterval(selectedAutoAlchemyInterval)">
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
                                    <alchemy id="alchemyStarIron" />
                                    <alchemy id="alchemyCharcoal" />
                                    <alchemy id="alchemySaltpeter" />
                                    <alchemy id="alchemyIron" />
                                    <alchemy id="alchemyJade" />
                                    <alchemy id="alchemyTimber" />
                                    <alchemy id="alchemyBronze" />
                                    <alchemy id="alchemyCinnabar" />
                                    <alchemy id="alchemyMagma" />
                                    <alchemy id="alchemyMoonSilver" />
                                    <alchemy id="alchemyNiter" />
                                    <alchemy id="alchemyDarkSteel" />
                                    <alchemy id="alchemyGold" />
                                    <alchemy id="alchemySilver" />
                                    <alchemy id="alchemySpiritVein" />
                                    <alchemy id="alchemyVoidEssence" />
                                    <alchemy id="alchemyFrostCrystal" />
                                </div>
                            </div>
                        </card>
                    </pane>
                    
                    <!-- DYSON PANE -->
                    <pane id="grandFormationPane" icon="grandFormation.png" :descs="['grandFormationPane_desc']">
                        <buildable id="formationCore" btnText="build" />
                        <buildable id="grandFormationT1" btnText="build" />
                        <buildable id="grandFormationT2" btnText="build" />
                        <buildable id="grandFormationT3" btnText="build" />
                    </pane>
                    
                    <!-- ANTIMATTER PANE -->
                    <pane id="chaosEssencePane" icon="chaosEssence.png" :descs="['chaosEssencePane_desc']">
                        <buildable id="chaosEssenceT1" btnText="build" />
                    </pane>
                    
                    <!-- COMMUNICATION PANE -->
                    <pane id="scoutPane" icon="scout.png" :descs="['scoutPane_desc']">
                        <buildable id="scoutT1" btnText="build" />
                        <buildable id="scoutT2" btnText="build" />
                    </pane>
                    
                    <!-- SPACESHIP PANE -->
                    <pane id="warEnginePane" icon="warEngine.png" :descs="['warEnginePane_desc']">
                        <buildable id="warEngine" btnText="build" />
                        <buildable id="armor" btnText="build" />
                        <buildable id="warhorse" btnText="build" />
                        <buildable id="banner" btnText="build" />
                    </pane>
                    
                    <!-- MILITARY PANE -->
                    <pane id="militaryPane" icon="military.png">
                        <fleet id="fleet" />
                        <buildable id="soldierT1" btnText="build" />
                        <buildable id="soldierT2" btnText="build" />
                        <buildable id="soldierT3" btnText="build" />
                        <buildable id="soldierT4" btnText="build" />
                        <buildable id="soldierT5" btnText="build" />
                    </pane>
                    
                    <!-- INTERSTELLAR CARNELIAN PANE -->
                    <pane id="dominionCrimsonLotusPane" icon="crimsonLotus.png" :descs="['dominionCrimsonLotusPane_desc']">
                        <star id="fief301"    /> <star id="fief163901" /> <star id="fief181901" /> <star id="fief151801" /> <star id="fief25401"  /> <star id="fief146301" />
                        <star id="fief122601" /> <star id="fief79501"  /> <star id="fief1501"   /> <star id="fief79901"  /> <star id="fief37601"  /> <star id="fief123401" />
                        <star id="fief164301" /> <star id="fief219102" /> <star id="fief204702" /> <star id="fief116901" /> <star id="fief74001"  /> <star id="fief205102" />
                        <star id="fief144001" /> <star id="fief222301" /> <star id="fief3901"   /> <star id="fief168301" /> <star id="fief120901" /> <star id="fief125301" />
                        <star id="fief113101" /> <star id="fief89101"  /> <star id="fief93901"  /> <star id="fief79201"  /> <star id="fief80501"  /> <star id="fief77301"  />
                        <star id="fief191701" /> <star id="fief199702" /> <star id="fief21001"  /> <star id="fief178302" /> <star id="fief32201"  /> <star id="fief74801"  />
                    </pane>
                    
                    <!-- INTERSTELLAR PRASNIAN PANE -->
                    <pane id="dominionJadeThronePane" icon="jadeThrone.png" :descs="['dominionJadeThronePane_desc']">
                        <star id="fief401"    /> <star id="fief25101"  /> <star id="fief207601" /> <star id="fief223901" /> <star id="fief121101" /> <star id="fief136701" />
                        <star id="fief166402" /> <star id="fief95001"  /> <star id="fief175902" /> <star id="fief56501"  /> <star id="fief167801" /> <star id="fief103201" />
                        <star id="fief113301" /> <star id="fief199602" /> <star id="fief157201" /> <star id="fief222201" /> <star id="fief6301"   /> <star id="fief214301" />
                        <star id="fief40801"  /> <star id="fief207301" /> <star id="fief169601" /> <star id="fief157101" /> <star id="fief178501" /> <star id="fief208601" />
                        <star id="fief78101"  /> <star id="fief123501" /> <star id="fief85901"  /> <star id="fief18501"  /> <star id="fief199801" /> <star id="fief141901" />
                        <star id="fief5201"   /> <star id="fief223701" /> <star id="fief166903" /> <star id="fief32101"  /> <star id="fief77801"  /> <star id="fief205201" />
                    </pane>
                    
                    <!-- INTERSTELLAR HYACINITE PANE -->
                    <pane id="dominionAzureAcademyPane" icon="azureAcademy.png" :descs="['dominionAzureAcademyPane_desc']">
                        <star id="fief201"    /> <star id="fief217101" /> <star id="fief166701" /> <star id="fief179501" /> <star id="fief6501"   /> <star id="fief222401" />
                        <star id="fief200001" /> <star id="fief24201"  /> <star id="fief224202" /> <star id="fief92801"  /> <star id="fief172701" /> <star id="fief86401"  />
                        <star id="fief202902" /> <star id="fief177001" /> <star id="fief68301"  /> <star id="fief205001" /> <star id="fief13401"  /> <star id="fief34201"  />
                        <star id="fief182101" /> <star id="fief178401" /> <star id="fief107601" /> <star id="fief192101" /> <star id="fief24001"  /> <star id="fief16601"  />
                        <star id="fief27501"  /> <star id="fief121601" /> <star id="fief212102" /> <star id="fief117501" />
                    </pane>
                    
                    <!-- INTERSTELLAR KITRINOS PANE -->
                    <pane id="dominionGoldenCartelPane" icon="goldenCartel.png" :descs="['dominionGoldenCartelPane_desc']">
                        <star id="fief501"    /> <star id="fief130601" /> <star id="fief158101" /> <star id="fief224601" /> <star id="fief58601"  /> <star id="fief10101"  />
                        <star id="fief194201" /> <star id="fief1101"   /> <star id="fief72501"  /> <star id="fief210501" /> <star id="fief189701" /> <star id="fief175601" />
                        <star id="fief206902" /> <star id="fief133601" /> <star id="fief135801" /> <star id="fief39101"  /> <star id="fief107001" /> <star id="fief105801" />
                        <star id="fief224201" /> <star id="fief205101" /> <star id="fief162501" /> <star id="fief4001"   /> <star id="fief141101" /> <star id="fief180502" />
                        <star id="fief208702" /> <star id="fief85501"  /> <star id="fief217202" /> <star id="fief180101" /> <star id="fief13801"  /> <star id="fief37101"  />
                        <star id="fief42501"  /> <star id="fief80901"  /> <star id="fief215902" /> <star id="fief190502" /> <star id="fief99701"  /> <star id="fief176802" />
                    </pane>
                    
                    <!-- INTERSTELLAR MOVITON PANE -->
                    <pane id="dominionIronLegionPane" icon="ironLegion.png" :descs="['dominionIronLegionPane_desc']">
                        <star id="fief701"    /> <star id="fief601"    /> <star id="fief80101"  /> <star id="fief213301" /> <star id="fief13601"  /> <star id="fief51801"  />
                        <star id="fief35801"  /> <star id="fief216801" /> <star id="fief224101" /> <star id="fief114001" /> <star id="fief15301"  /> <star id="fief69601"  />
                        <star id="fief148501" /> <star id="fief155801" /> <star id="fief185101" /> <star id="fief175901" /> <star id="fief203902" /> <star id="fief204801" />
                        <star id="fief211202" /> <star id="fief100801" /> <star id="fief124101" /> <star id="fief139701" /> <star id="fief50401"  /> <star id="fief159101" />
                        <star id="fief148101" /> <star id="fief157301" /> <star id="fief72601"  /> <star id="fief224801" /> <star id="fief71001"  /> <star id="fief207501" />
                        <star id="fief168302" /> <star id="fief128901" /> <star id="fief68401"  /> <star id="fief30701"  /> <star id="fief193402" /> <star id="fief84201"  />
                        <star id="fief76401"  /> <star id="fief32301"  /> <star id="fief191401" /> <star id="fief118301" /> <star id="fief166901" /> <star id="fief62901"  />
                        <star id="fief21601"  /> <star id="fief63801"  /> <star id="fief187202" />
                    </pane>
                    
                    <!-- DARKMATTER PANE -->
                    <pane id="mandatePane" icon="mandate.png" :descs="['mandatePane_desc1', 'mandatePane_desc2', 'mandatePane_desc3', 'mandatePane_desc4', 'mandatePane_desc5']">
                        <card id="mandate" :descs="['mandate_desc']">
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
                    
                    <!-- STARGAZE CARNELIAN PANE -->
                    <pane id="mandateCrimsonLotusPane" icon="crimsonLotus.png" :descs="['mandateCrimsonLotusPane_desc']">
                        <buildable id="upgradeGain" btnText="activate" />
                        <buildable id="upgradeStorage1" btnText="activate" />
                        <buildable id="upgradeStorage2" btnText="activate" />
                        <buildable id="techVitalityStorage6" btnText="activate" />
                        <buildable id="upgradeStorage3" btnText="activate" />
                    </pane>
                    
                    <!-- STARGAZE PRASNIAN PANE -->
                    <pane id="mandateJadeThronePane" icon="jadeThrone.png" :descs="['mandateJadeThronePane_desc']">
                        <buildable id="techDragonFire3" btnText="activate" />
                        <buildable id="upgradeLegend1" btnText="activate" />
                        <buildable id="techDragonFireStorage3" btnText="activate" />
                        <buildable id="upgradeLegend2" btnText="activate" />
                        <buildable id="upgradeLegend3" btnText="activate" />
                        <buildable id="autoAlchemy" btnText="activate" />
                        <buildable id="techDragonFire4" btnText="activate" />
                    </pane>
                    
                    <!-- STARGAZE HYACINITE PANE -->
                    <pane id="mandateAzureAcademyPane" icon="azureAcademy.png" :descs="['mandateAzureAcademyPane_desc']">
                        <buildable id="upgradeScholarship1" btnText="activate" />
                        <buildable id="upgradeScholarship2" btnText="activate" />
                        <buildable id="techScholarship5" btnText="activate" />
                        <buildable id="upgradeVitalityBoost" btnText="activate" />
                    </pane>
                    
                    <!-- STARGAZE KITRINOS PANE -->
                    <pane id="mandateGoldenCartelPane" icon="goldenCartel.png" :descs="['mandateGoldenCartelPane_desc']">
                        <buildable id="upgradeTier1" btnText="activate" />
                        <buildable id="techVitalityStorage5" btnText="activate" />
                        <buildable id="multiBuy" btnText="activate" />
                        <buildable id="boostCapital" btnText="activate" />
                        <buildable id="techTier5" btnText="activate" />
                    </pane>
                    
                    <!-- STARGAZE MOVITON PANE -->
                    <pane id="mandateIronLegionPane" icon="ironLegion.png" :descs="['mandateIronLegionPane_desc']">
                        <buildable id="upgradeWarFuel1" btnText="activate" />
                        <buildable id="upgradeWarEngine" btnText="activate" />
                        <buildable id="techStarIron3" btnText="activate" />
                        <buildable id="techStarIron4" btnText="activate" />
                    </pane>
                    
                    <!-- STARGAZE OVERLORD PANE -->
                    <pane id="mandateCelestialWillPane" icon="celestialWill.png" :descs="['mandateCelestialWillPane_desc']">
                        <buildable id="boostMandate" btnText="activate" />
                        <buildable id="upgradeFaction" btnText="activate" />
                    </pane>
                        
                    <!-- DONATING PANE -->
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
                                                <div class="col-auto d-flex align-items-center"><span class="icon-emoji-md">{{ UI_EMOJI.paypal }}</span></div>
                                                <div class="col-auto">{{ $t('donate') }}</div>
                                            </div>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </card>
                    </pane>
                    
                    <!-- ACHIEVEMENTS PANE -->
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
                                            <td><small class="text-normal">{{ $t('mandate') }}</small></td>
                                            <td class="text-end"><small class="text-light">{{ numeralFormat(data['mandate'].count.toPrecision(4), '0.[000]a') }}</small></td>
                                            <td class="text-end"><small class="text-light">{{ numeralFormat(stats.allTimeMandate.toPrecision(4), '0.[000]a') }}</small></td>
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
                                                            <span class="icon-emoji-md">{{ getInterfaceIcon(ach.icon) }}</span>
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
                                                            <span class="icon-emoji-md">{{ getInterfaceIcon(ach.icon) }}</span>
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
                    
                    <!-- HELP PANE -->
                    <pane id="helpPane" icon="help.png" :descs="['helpPane_desc']">
                        <card id="help1" :descs="['help1_desc1']" checked="true" />
                        <card id="help2" :descs="['help2_desc1', 'help2_desc2']" checked="true" />
                        <card id="help3" :descs="['help3_desc1']" checked="true" />
                        <card id="help4" :descs="['help4_desc1']" checked="true" />
                    </pane>
                    
                    <!-- OPTIONS PANE -->
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
                    
                    <!-- ABOUT PANE -->
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
                    
                    <!-- RANK PANE -->
                    <pane id="rankPane" icon="rank.png" :descs="['rankPane_desc']">
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
                                    <small class="text-normal">{{ $t('soldierT1') }}</small>
                                </div>
                                <div class="col-auto">
                                    <span class="text-light">{{ data['soldierT1'].active }}</span>
                                    <small class="ms-1 text-normal">/{{ data['soldierT1'].count }}</small>
                                </div>
                                <div class="col-auto">
                                    <div class="btn-group">
                                        <button class="btn p-1" @click="setActiveShip({ id:'soldierT1', count:1 })">
                                            +
                                        </button>
                                        <button class="btn p-1" @click="setActiveShip({ id:'soldierT1', count:'max' })">
                                            ++
                                        </button>
                                    </div>
                                </div>
                                <div class="col-auto">
                                    <div class="btn-group">
                                        <button class="btn p-1" @click="setActiveShip({ id:'soldierT1', count:-1 })">
                                            -
                                        </button>
                                        <button class="btn p-1" @click="setActiveShip({ id:'soldierT1', count:'none' })">
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
                        <div v-for="shipId in ['soldierT1', 'soldierT2', 'soldierT3', 'soldierT4', 'soldierT5']" :key="shipId" class="col-12">
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
    <div v-if="loaded" id="formationCoreModal" class="modal fade">
        <div class="modal-dialog modal-dialog-scrollable" role="dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="row g-2">
                        <div class="col-12">
                            <span class="h6 text-light">{{ $t('formationCoreModal') }}</span>
                        </div>
                        <div class="col-12">
                            <calc-formationCore />
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
                                <li>NEW: shadowNetworks DM upgrade will be removed for the moment (those who have it keep it until next rebirth)</li>
                            </ul>
                        </div>
                        <div class="col-12 border-top">
                            <div class="text-light">v1.15.0 - 2021-06-24</div>
                            <ul class="small">
                                <li>FIX: 'Battery Efficiency' still doesn't increase battery storage in v1.14.0</li>
                                <li>FIX: reaching 250 resource machines, or reaching 50T produced resources gives negative XP</li>
                                <li>FIX: shadowNetwork resource not showing the resource it is on, after refresh</li>
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
                                <li>NEW: display real 'Max' amount of dragonFire/vitality to be converted</li>
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
import { getInterfaceIcon, UI_EMOJI } from './utils/assets'

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
        'alchemy': Emc,
        'star': Star,
        'fleet': Fleet,
        'calc-formationCore': CalcSegment,
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
            
            calcId: 'iron',
            activeStar: 'fief201',
            
            spyModal: null,
            invadeModal: null,
            absorbModal: null,
            rebirthModal: null,
            changeLogModal: null,
            hardResetModal: null,
            formationCoreModal: null,
            calcModal: null,
            
            currentRelease: '1.16.0',
            ghLatestRelease: null,
            
            login: null,
            password: null,
            
            leaderboard_ranks: null,
            
            selectedAlchemyAmount: null,
            selectedAutoAlchemyInterval: null,
        }
    },
    computed: {
        ...mapState([
        
            'data', 'companyName', 'locale', 'activePane', 'lastUpdateTime', 'autoSaveInterval', 'timeSinceAutoSave', 'rank',
            'resAchievements', 'prodAchievements', 'newAchievement',
            'notifAutoSave', 'notifAchievement', 'displayLockedItems',
            'username', 'token',
            'alchemyAmount', 'autoAlchemyInterval', 'timeSinceAutoAlchemy',
            'stats',
        ]),
        ...mapGetters([

            'isNotif', 'hasNotif',
            'getThreat', 'getSpyChance', 'getInvadeChance', 'getStarPower', 'getStarDefense', 'getStarSpeed',
            'getDMWonders', 'getDMSpheres', 'getDMResearches', 'getDMRank', 'getDMSwarms', 'getPotentialDM',
        ]),
        UI_EMOJI() { return UI_EMOJI },
    },
    created() {        
        setTimeout(this.start, 1000)
    },
    methods: {
        getInterfaceIcon,
        ...mapMutations([
        
            'setLocale', 'setActivePane', 'setLastUpdateTime', 'setTimeSinceAutoSave', 'setCompanyName', 'setAutoSaveInterval',
            'setNotifAutoSave', 'setNotifAchievement', 'setDisplayLockedItems', 'setUsername', 'setToken', 'setAlchemyAmount', 'setTimeSinceAutoAlchemy', 'setAutoAlchemyInterval',
        ]),
        ...mapActions([
        
            'initialize', 'load',
            'computeProdValues', 'produceResources', 'updateTimers', 'checkBoosts', 'updateAchievements', 'save',
            'setActiveShip', 'spy', 'invade', 'absorb',
            'rebirth', 'performAutoAlchemy',
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
            this.selectedAlchemyAmount = this.alchemyAmount
            this.selectedAutoAlchemyInterval = this.autoAlchemyInterval / 1000
            
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
                
                element = document.getElementById('formationCoreModal')
                this.formationCoreModal = new Modal(element)
                
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
            this.setTimeSinceAutoAlchemy(this.timeSinceAutoAlchemy + delta)
            
            this.computeProdValues()
            this.produceResources(delta)
            this.updateTimers()
            this.checkBoosts()
            
            let timeLeft = this.autoAlchemyInterval - (this.timeSinceAutoAlchemy * 1000)
            if (timeLeft < 100) {
                this.performAutoAlchemy()
                this.setTimeSinceAutoAlchemy(0)
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
        delete this.formationCoreModal
        delete this.calcModal
        
        clearInterval(this.fastInterval)
        clearInterval(this.slowInterval)
        clearInterval(this.ghInterval)
    },
}
</script>