'use strict';

angular.module('myApp.pd-main', ['ngSanitize'])

.controller('PdController', ['$scope', '$http', function($scope, $http) {
	var pollutant_group_details = null;

	//$scope.pollutantid;
	
	$scope.getPollutantData = function(){
		$http.get('translations/pollutants_details_en-gb.json').success(function(data, status) {
			$scope.pollutants_details = new Array();
			for(var i = 0; i<data.pollutants.pollutant.length;i++){
				$scope.pollutants_details[data.pollutants.pollutant[i].lov_pollutant_id] =data.pollutants.pollutant[i];
				if(data.pollutants.pollutant[i].lov_pollutant_id == $scope.pollutantid){
					$scope.pollutant_details = data.pollutants.pollutant[i];
				}
			}
			if (!($scope.pollutant_details.main_methods_of_release.text instanceof Array)){
				var txt = $scope.pollutant_details.main_methods_of_release.text;
				$scope.pollutant_details.main_methods_of_release.text = [txt];
			}
			if($scope.pollutant_details.iso_provisions.hasOwnProperty('provision')){
				if (!($scope.pollutant_details.iso_provisions.provision instanceof Array)){
					$scope.pollutant_details.iso_provisions.provision = [$scope.pollutant_details.iso_provisions.provision];
				}
			}
			if (!($scope.pollutant_details.health_affects.text instanceof Array)){
				$scope.pollutant_details.health_affects.text = [$scope.pollutant_details.health_affects.text];
			}
			
			}).error(function(data, status) {
			console.log("Error: " + data + " status: " + status);
		});
	};
	
	$scope.getPollutantGroupData = function(){
		$http.get('translations/pollutants_groups_en-gb.json').success(function(data, status) {
			var pollutant_groups = data.pollutants.pollutantGroups.pollutant_Group;
			for(var j = 0; j<pollutant_groups.length ;j++){
				for(var i = 0; i<pollutant_groups[j].pollutant.length ;i++){
					if(pollutant_groups[j].pollutant[i].pollutant_no == $scope.pollutantid){
						$scope.pollutant_group_details = pollutant_groups[j].pollutant[i];
					}
				}
			}
			if(!($scope.pollutant_group_details.other_provisions.other_provision instanceof Array) && 
					$scope.pollutant_group_details.other_provisions.hasOwnProperty('other_provision')){
				$scope.pollutant_group_details.other_provisions.other_provision = [$scope.pollutant_group_details.other_provisions.other_provision];
			}
			if($scope.pollutant_group_details.classifications.classification instanceof Array){
				var str = $scope.pollutant_group_details.classifications.classification[0];
				for(var a = 1; a< $scope.pollutant_group_details.classifications.classification.length;a++){
					str += ", "+ $scope.pollutant_group_details.classifications.classification[a];
				}
				$scope.pollutant_group_details.classifications.classification = str;
			}
			if(!($scope.pollutant_group_details.synonyms.synonym instanceof Array) && $scope.pollutant_group_details.synonyms.hasOwnProperty('synonym')){
				var synonym = $scope.pollutant_group_details.synonyms.synonym;
				$scope.pollutant_group_details.synonyms.synonym = new Array();
				$scope.pollutant_group_details.synonyms.synonym = [synonym];
			}
			
			if($scope.pollutant_group_details.pollutant_group_info.group_member instanceof Array){
				$scope.pollutant_group_details.group_members = new Array();
				for(var i=0; i<$scope.pollutant_group_details.pollutant_group_info.group_member.length;i++){
					var id = $scope.pollutant_group_details.pollutant_group_info.group_member[i].pollutantno;
					$scope.pollutant_group_details.group_members[i] = new Object();
					$scope.pollutant_group_details.group_members[i].id = id;
					$scope.pollutant_group_details.group_members[i].name = $scope.pollutants_details[id].pollutant_name;
				}
			}
			
			pollutant_group_details = $scope.pollutant_group_details;
			$scope.getLookupData();
			
			}).error(function(data, status) {
			console.log("Error: " + data + " status: " + status);
		});

	};
	
	$scope.getLookupData = function(){
		$http.get('translations/pollutants_lookup_en-gb.json').success(function(data, status) {
			var other_provisions = new Array();
			var r_phrases = new Array();
			var s_phrases = new Array();
			var hazard_class = new Array();
			var hazard_statement = new Array();
			
			$scope.lookup = new Array();
			if($scope.pollutant_group_details.other_provisions.hasOwnProperty('other_provision')){
				for(var i=0; i< pollutant_group_details.other_provisions.other_provision.length; i++){
					other_provisions[i]={instrument:null, overview:null, generic_reporting:null, specific_reporting:null};
				}
			}
			
			
			for(var i = 0; i<data.phrases.phrase.length;i++){
				var lookup_phrase = data.phrases.phrase[i];
				if(lookup_phrase._groupId == pollutant_group_details.pollutant_group){
					$scope.pollutant_group_name = lookup_phrase._text;
				}
				if(lookup_phrase._groupIdtip == pollutant_group_details.pollutant_group){
					$scope.pollutant_group_tip = $scope.stringReplaceSub(lookup_phrase._text, lookup_phrase.sub);
					
				}
				
				switch(lookup_phrase._id){
				case 'state':
					$scope.lookup_state = lookup_phrase._text;
					break;
				case 'melt_freeze_point':
					$scope.lookup_melt_freeze = lookup_phrase._text;
					break;
				case 'boiling_point':
					$scope.lookup_boiling_point = lookup_phrase._text;
					break;
				case 'vapour_pressure':
					$scope.lookup_vapour_pressure = lookup_phrase._text;
					break;
				case 'water_solubility':
					$scope.lookup_water_solubility = lookup_phrase._text;
					break;
				case 'partition_coeff':
					$scope.lookup_partition_coeff = lookup_phrase._text;
					break;
				case 'flammable_limits':
					$scope.lookup_flammable_limits = lookup_phrase._text;
					break;
				case 'flash_point':
					$scope.lookup_flash_point = lookup_phrase._text;
					break;
				case 'autoignition_temp':
					$scope.lookup_autoignition_temp = lookup_phrase._text;
					break;
				case 'density':
					$scope.lookup_density = lookup_phrase._text;
					break;
				case 'vapour_density':
					$scope.lookup_vapour_density = lookup_phrase._text;
					break;
				case 'ph':
					$scope.lookup_ph = lookup_phrase._text;
					break;
				case 'dissocation_const':
					$scope.lookup_dissocation_const = lookup_phrase._text;
					break;
				case 'aquatic_tox_ec50':
					$scope.lookup['aquatic_tox_ec50'] = lookup_phrase._text;
					break;
				case 'aquatic_tox_lc50':
					$scope.lookup['aquatic_tox_lc50'] = lookup_phrase._text;
					break;
				case 'aquatic_tox_lclod':
					$scope.lookup['aquatic_tox_lclod'] = lookup_phrase._text;
					break;
				case 'aquatic_tox_lg50':
					$scope.lookup['aquatic_tox_lg50'] = lookup_phrase._text;
					break;
				case 'bioaccumulation':
					$scope.lookup['bioaccumulation'] = lookup_phrase._text;
					break;
				case 'biological_ox_demand':
					$scope.lookup['biological_ox_demand'] = lookup_phrase._text;
					break;
				case 'carcinogenicity':
					$scope.lookup['carcinogenicity'] = lookup_phrase._text;
					break;
				case 'marine_tox':
					$scope.lookup['marine_tox'] = lookup_phrase._text;
					break;
				case 'mutagenicity':
					$scope.lookup['mutagenicity'] = lookup_phrase._text;
					break;
				case 'persistence':
					$scope.lookup['persistence'] = lookup_phrase._text;
					break;
				case 'toxicity':
					$scope.lookup['toxicity'] = lookup_phrase._text;
					break;
				case 'WEL_OEL':
					$scope.lookup['wel_oel'] = lookup_phrase._text;
					break;
				}
				
				if(pollutant_group_details.other_provisions.hasOwnProperty('other_provision')){
					for(var j =0; j< pollutant_group_details.other_provisions.other_provision.length;j++){
						var other_provision_id = pollutant_group_details.other_provisions.other_provision[j];
						if(lookup_phrase._other_provision_instrument == other_provision_id){
							other_provisions[j].instrument = lookup_phrase._text;
						}
						if(lookup_phrase._other_provision_overview == other_provision_id){
							if(lookup_phrase.hasOwnProperty('sub')){
								other_provisions[j].overview = $scope.stringReplaceSub(lookup_phrase._text, lookup_phrase.sub);
							}else{
								other_provisions[j].overview  = lookup_phrase._text;
							}
						}
						if(lookup_phrase._other_provision_reporting == other_provision_id){
							if(lookup_phrase.hasOwnProperty('sub')){
								other_provisions[j].generic_reporting = $scope.stringReplaceSub(lookup_phrase._text, lookup_phrase.sub);
							}else{
								other_provisions[j].generic_reporting = lookup_phrase._text;
							}
						}
						if(lookup_phrase._other_provision_reporting == other_provision_id+"."+$scope.pollutantid){
							if(lookup_phrase.hasOwnProperty('sub')){
								other_provisions[j].specific_reporting = $scope.stringReplaceSub(lookup_phrase._text, lookup_phrase.sub);
							}else{
								other_provisions[j].specific_reporting = lookup_phrase._text;
							}
						}
					}	
				}
				
				r_phrases = r_phrases.concat($scope.createLookupArray(pollutant_group_details.r_phrases.r_phrase, lookup_phrase._r_phrase_id, lookup_phrase._text  ));
				s_phrases = s_phrases.concat($scope.createLookupArray(pollutant_group_details.s_phrases.s_phrase, lookup_phrase._s_phrase_id, lookup_phrase._text  ));
				
				hazard_class = hazard_class.concat($scope.createLookupArray(pollutant_group_details.clp.clp_phrase, lookup_phrase._clp_phrase_id, lookup_phrase._text));
				
				hazard_statement = hazard_statement.concat($scope.createLookupArray(pollutant_group_details.ghs.ghs_phrase, lookup_phrase._ghs_phrase_id, lookup_phrase._text));
				
				$scope.r_phrases = r_phrases;
				$scope.s_phrases = s_phrases;
				$scope.hazard_class = hazard_class;
				$scope.hazard_statement = hazard_statement;
			}
			$scope.other_provisions=other_provisions;
			$scope.getPollutantPhysicalData();
			$scope.getPollutantHazardData();
			$scope.calculateStringWithSubs();
			}).error(function(data, status) {
			console.log("Error: " + data + " status: " + status);
		});
	};
	
	$scope.getLabelData = function(){
		$http.get('translations/pollutants_labels_en-gb.json').success(function(data, status) {
			for(var i = 0; i<data.labels.label.length;i++){
				var label = data.labels.label[i];
				switch(label._id){
				case 'pollutanthead':
					$scope.label_pollutant_head = label._text;
					break;
				case 'pollutantheadnotes':
					$scope.label_pollutant_headnotes = label._text;
					break;
				case 'PollutantId':
					$scope.label_pollutant_id = label._text;
					break;
				case 'IUPAC':
					$scope.label_iupac = label._text;
					break;
				case 'CASNumber':
					$scope.label_cas_number = label._text;
					break;
				case 'ECNumber':
					$scope.label_ec_number = label._text;
					break;
				case 'smiles':
					$scope.label_smiles = label._text;
					break;
				case 'chemspider':
					$scope.label_chemspider = label._text;
					break;
				case 'Formula':
					$scope.label_formula = label._text;
					break;
				case 'Classification':
					$scope.label_classification = label._text;
					break;
				case 'description':
					$scope.label_description = label._text;
					break;
				case 'mainuses':
					$scope.label_main_uses = label._text;
					break;
				case 'mainmethodsrelease':
					$scope.label_main_methods_release = label._text;
					break;
				case 'healthAffects':
					$scope.label_health_affects = label._text;
					break;
				case 'Group':
					$scope.label_pollutant_group = label._text;
					break;
				case 'provprtr':
					$scope.label_provprtr = label._text;
					break;
				case 'threshold':
					$scope.label_threshold = label._text;
					break;
				case 'air':
					$scope.label_air = label._text;
					break;
				case 'water':
					$scope.label_water = label._text;
					break;
				case 'land':
					$scope.label_land = label._text;
					break;
				case 'provprtrNote':
					$scope.label_provision_prtr_note = label._text;
					break;
				case 'provprtrNote2':
					if($scope.pollutantid == 89 || $scope.pollutantid == 90 || $scope.pollutantid == 91 || $scope.pollutantid == 92){
						$scope.label_provision_prtr_note2 = label._text;
					}else{
						$scope.label_provision_prtr_note2 = "";
					}
					
					break;
				case 'proviso':
					$scope.label_proviso = label._text;
					break;
				case 'isostandard':
					$scope.label_iso_standard = label._text;
					break;
				case 'isotitle':
					$scope.label_iso_title = label._text;
					break;
				case 'isotarget':
					$scope.label_iso_target = label._text;
					break;
				case 'isouncert':
					$scope.label_iso_uncertainty = label._text;
					break;
				case 'isoFootNoteTitle':
					$scope.label_iso_foot_note_title = label._text;
					break;
				case 'isoFootNote1':
					$scope.label_iso_foot_note1 = label._text;
					break;
				case 'isoFootNote2':
					$scope.label_iso_foot_note2 = label._text;
					break;
				case 'isoFootNote3':
					$scope.label_iso_foot_note3 = label._text;
					break;
				case 'isoFootNoteLink1':
					$scope.label_iso_foot_note_link1 = label._text;
					break;
				case 'isoFootNote4':
					$scope.label_iso_foot_note4 = label._text;
					break;
				case 'isoFootNoteLink2':
					$scope.label_iso_foot_note_link2 = label._text;
					break;
				case 'isoFootNote5':
					$scope.label_iso_foot_note5 = label._text;
					break;
				case 'isoFootNote6':
					$scope.label_iso_foot_note6 = label._text;
					break;
				case 'synonyms':
					$scope.label_synonyms = label._text;
					break;
				case 'provother':
					$scope.label_provision_other = label._text;
					break;
				case 'provOverview':
					$scope.label_provision_overview = label._text;
					break;
				case 'provReportGeneric':
					$scope.label_provision_report_generic = label._text;
					break;
				case 'provReportSpecific':
					$scope.label_provision_report_specific = label._text;
					break;
				case 'rands':
					$scope.label_safety_phrases = label._text;
					break;
				case 'randsex':
					$scope.label_safety_phrases_text = label._text;
					break;
				case 'clpghs':
					$scope.label_classification_labelling = label._text;
					break;
				case 'clpex':
					$scope.label_classification_labelling_text = label._text;
					break;
				case 'clpLinkText':
					$scope.label_classification_labelling_link_text = label._text;
					break;
				case 'clpLinkUrl':
					$scope.label_classification_labelling_link_url = label._text;
					break;
				case 'clp':
					$scope.label_classification_labelling_hazard_class = label._text;
					break;
				case 'ghs':
					$scope.label_classification_labelling_hazard_statements = label._text;
					break;
				case 'physical':
					$scope.label_physical = label._text;
					break;
				case 'impacts':
					$scope.label_impacts= label._text;
					break;	
				}
			}
			}).error(function(data, status) {
			console.log("Error: " + data + " status: " + status);
		});
	};
	
	$scope.getPollutantPhysicalData = function(){
		var physical_properties = new Array();
		var pd = $scope.pollutant_details;
		if(pd.hasOwnProperty('state')){
			var physical_object = new Object();
			physical_object.label = $scope.lookup_state; 
			physical_object.value = pd.state;
			physical_properties[physical_properties.length]=physical_object;
		}
		if(pd.hasOwnProperty('melt_freeze_point')){
			var physical_object = new Object();
			physical_object.label = $scope.lookup_melt_freeze; 
			physical_object.value = pd.melt_freeze_point;
			physical_properties[physical_properties.length]=physical_object;
		}
		if(pd.hasOwnProperty('boiling_point')){
			var physical_object = new Object();
			physical_object.label = $scope.lookup_boiling_point; 
			physical_object.value = pd.boiling_point;
			physical_properties[physical_properties.length]=physical_object;
		}
		if(pd.hasOwnProperty('vapour_pressure')){
			var physical_object = new Object();
			physical_object.label = $scope.lookup_vapour_pressure; 
			physical_object.value = pd.vapour_pressure;
			physical_properties[physical_properties.length]=physical_object;
		}
		if(pd.hasOwnProperty('water_solubility')){
			var physical_object = new Object();
			physical_object.label = $scope.lookup_water_solubility; 
			physical_object.value = pd.water_solubility;
			physical_properties[physical_properties.length]=physical_object;
		}
		if(pd.hasOwnProperty('partition_coeff')){
			var physical_object = new Object();
			physical_object.label = $scope.lookup_partition_coeff; 
			physical_object.value = pd.partition_coeff;
			physical_properties[physical_properties.length]=physical_object;
		}
		if(pd.hasOwnProperty('dissocation_const')){
			var physical_object = new Object();
			physical_object.label = $scope.lookup_dissocation_const; 
			physical_object.value = pd.dissocation_const;
			physical_properties[physical_properties.length]=physical_object;
		}
		if(pd.hasOwnProperty('ph')){
			var physical_object = new Object();
			physical_object.label = $scope.lookup_ph; 
			physical_object.value = pd.ph;
			physical_properties[physical_properties.length]=physical_object;
		}
		if(pd.hasOwnProperty('flammable_limits')){
			var physical_object = new Object();
			physical_object.label = $scope.lookup_flammable_limits; 
			physical_object.value = pd.flammable_limits;
			physical_properties[physical_properties.length]=physical_object;
		}
		if(pd.hasOwnProperty('flash_point')){
			var physical_object = new Object();
			physical_object.label = $scope.lookup_flash_point; 
			physical_object.value = pd.flash_point;
			physical_properties[physical_properties.length]=physical_object;
		}
		if(pd.hasOwnProperty('autoignition_temp')){
			var physical_object = new Object();
			physical_object.label = $scope.lookup_autoignition_temp; 
			physical_object.value = pd.autoignition_temp;
			physical_properties[physical_properties.length]=physical_object;
		}
		if(pd.hasOwnProperty('density')){
			var physical_object = new Object();
			physical_object.label = $scope.lookup_density; 
			physical_object.value = pd.density;
			physical_properties[physical_properties.length]=physical_object;
		}
		if(pd.hasOwnProperty('vapour_density')){
			var physical_object = new Object();
			physical_object.label = $scope.lookup_vapour_density; 
			physical_object.value = pd.vapour_density;
			physical_properties[physical_properties.length]=physical_object;
		}
		$scope.physical_properties = physical_properties;
	}
	
	$scope.getPollutantHazardData = function(){
		var hazards = new Array();
		var pd = $scope.pollutant_details;
		var hazard_values = ['aquatic_tox_ec50', 'aquatic_tox_lc50', 'aquatic_tox_lclod', 'aquatic_tox_lg50', 'bioaccumulation', 'biological_ox_demand', 'carcinogenicity','marine_tox','mutagenicity', 'persistence','toxicity','WEL_OEL'];
		for(var h in hazard_values){
			if(pd.hasOwnProperty(hazard_values[h])){
				var hazard = new Object();
				hazard.label = $scope.lookup[hazard_values[h]]; 
				hazard.value = pd[hazard_values[h]];
				hazards[hazards.length]=hazard;
			}
		}
		$scope.hazards = hazards;
	}
	
	$scope.createLookupArray = function(array, lookup_id, lookup_text){
		if(lookup_id != undefined){
			var result = new Array();
			if(array instanceof Array){
				for(var j =0; j< array.length; j++){
					if(lookup_id == array[j]){
						var object = new Object();
						object.label = array[j];
						object.value = lookup_text;
						result[result.length] = object;
					}
				}
			}else{
				if(lookup_id == array){
					var object = new Object();
					object.label = array;
					object.value = lookup_text;
					result[result.length] = object;
				}
			}
			return result;
		}
		return new Array();
	}
	
	$scope.stringReplaceSub = function(str, subs){
		if(subs == undefined || subs.length<1){
			return str;
		}
		var sub_length = 0;
		if(subs instanceof Array){
			sub_length = subs.length;
		}else{
			sub_length=1;
			subs = [subs];
		}
		
		var counter = 0;
		for(var i = 0; i<subs.length; i++){
			var index = str.indexOf("\n");
			if(index == -1){
				str += '<sub>'+subs[i]+'</sub>';
			}else{
				str = str.substring(0,index)+ '<sub>'+subs[i]+'</sub>'+str.substring(index+1,str.length);
			}
		}
		return str;
	}
	
	$scope.stringReplaceSup = function(str, sups){
		if(sups == undefined || sups.length<1){
			return str;
		}
		var sup_length = 0;
		if(sups instanceof Array){
			sup_length = sups.length;
		}else{
			sup_length=1;
			sups = [sups];
		}
		
		var counter = 0;
		for(var i = 0; i<sups.length; i++){
			var index = str.indexOf("\n");
			if(index == -1){
				str += '<sup>'+sups[i]+'</sup>';
			}else{
				str = str.substring(0,index)+ '<sup>'+sups[i]+'</sup>'+str.substring(index+1,str.length);
			}
		}
		return str;
	}
	
	$scope.calculateStringWithSubs = function() {
		if(pollutant_group_details.molecular_formula.hasOwnProperty('_text')){
			$scope.pollutant_group_details.calculated_molecular_formula = $scope.stringReplaceSub(pollutant_group_details.molecular_formula._text,pollutant_group_details.molecular_formula.sub);
		}else{
			$scope.pollutant_group_details.calculated_molecular_formula = pollutant_group_details.molecular_formula;
		}

		if($scope.pollutant_details.hasOwnProperty('health_affects')){
			$scope.pollutant_details.calculated_health_affects= new Array();
			if(!($scope.pollutant_details.health_affects.text instanceof Array)){
				$scope.pollutant_details.health_affects.text = [$scope.pollutant_details.health_affects.text];
			}
			for(var i = 0; i<$scope.pollutant_details.health_affects.text.length;i++){
				if(!$scope.pollutant_details.health_affects.text[i].hasOwnProperty('sub')){
					$scope.pollutant_details.calculated_health_affects[i] = $scope.pollutant_details.health_affects.text[i];
				}else{
					var str = $scope.pollutant_details.health_affects.text[i]._text;
					var sub = $scope.pollutant_details.health_affects.text[i].sub;
					$scope.pollutant_details.calculated_health_affects[i] = $scope.stringReplaceSub(str,sub);
				}
			}
		}
		
		if($scope.pollutant_details.hasOwnProperty('iso_provisions') && $scope.pollutant_details.iso_provisions.hasOwnProperty('provision')){
			for(var i = 0; i<$scope.pollutant_details.iso_provisions.provision.length;i++){
				if($scope.pollutant_details.iso_provisions.provision[i].uncertainty.hasOwnProperty('sup')){
					$scope.pollutant_details.iso_provisions.provision[i].uncertainty = 
						$scope.stringReplaceSup($scope.pollutant_details.iso_provisions.provision[i].uncertainty._text, $scope.pollutant_details.iso_provisions.provision[i].uncertainty.sup);
				}
			}
		}
	}
	
	$scope.$watch('pollutantid', function(value){
		if($scope.pollutantid != undefined){
			$scope.getPollutantData();
			$scope.getPollutantGroupData();
			$scope.getLabelData();
		}
	});
	
}])
/*
 * This directive enables us to define this module as a custom HTML element
 *  
 * You can use only one of these parameters: 
 * */
.directive('pollutantDetails', function() {
	return {
		restrict: 'E',
		controller: 'PdController',
        transclude: true,
		scope: {
			pollutantid: '=pollutantid'
		},
		templateUrl: 'components/pollutants-details/pd-main.html',
		link: function(scope, element, attrs){
		}
	};
});