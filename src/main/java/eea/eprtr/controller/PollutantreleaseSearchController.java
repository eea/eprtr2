package eea.eprtr.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.Util.DataHelperPollutantRelease;
import eea.eprtr.dao.ActivitySearchFilter;
import eea.eprtr.dao.CountryAreaGroupRepository;
import eea.eprtr.dao.FacilityItemSearchFilter;
import eea.eprtr.dao.LocationSearchFilter;
import eea.eprtr.dao.PollutantSearchFilter;
import eea.eprtr.dao.PollutantSearchRepository;
import eea.eprtr.model.PollutantreleaseCounts;
import eea.eprtr.dao.PollutantreleaseSearchFilter;
import eea.eprtr.dao.PollutantreleaseSearchRepository;
import eea.eprtr.dao.ReportingYearSearchFilter;
import eea.eprtr.model.ActivityPollutantQuantity;
import eea.eprtr.model.LovPollutant;
import eea.eprtr.model.MediumCode;
import eea.eprtr.model.PollutantConfidentiality;
import eea.eprtr.model.Pollutantrelease;

@RestController
public class PollutantreleaseSearchController {

	@Autowired
	private PollutantreleaseSearchRepository pollutantreleaseSearchRepository;

	@Autowired
	private PollutantSearchRepository pollutantSearchRepository;

	@Autowired
	private CountryAreaGroupRepository countryAreaGroupRepository;

	@RequestMapping("/pollutantreleaseSearch")
    public List<Pollutantrelease> pollutantreleaseSearch(
    		
    		@RequestParam(value = "ReportingYear", required = false) Integer reportingYear,
    		
    		@RequestParam(value = "FacilityReportID", required = false) Integer facilityReportID,
    		@RequestParam(value = "FacilityID", required = false) Integer facilityID,

    		@RequestParam(value = "LOV_CountryID", required = false) Integer countryID,
    		@RequestParam(value = "LOV_AreaGroupID", required = false) Integer areaGroupID,
    		@RequestParam(value = "LOV_NUTSRegionID", required = false) Integer regionID,
    		@RequestParam(value = "LOV_RiverBasinDistrictID", required = false) Integer rbdID,
    		
    		@RequestParam(value = "LOV_IASectorID", required = false) Integer aiSectorID,
    		@RequestParam(value = "LOV_IAActivityID", required = false) Integer aiActivityID,
    		@RequestParam(value = "LOV_IASubActivityID", required = false) Integer aiSubActivityID,
    		@RequestParam(value = "LOV_NACESectorID", required = false) Integer naceSectorID,
    		@RequestParam(value = "LOV_NACEActivityID", required = false) Integer naceActivityID,
    		@RequestParam(value = "LOV_NACESubActivityID", required = false) Integer naceSubActivityID,
    		
    		@RequestParam(value = "LOV_PollutantID", required = false) Integer pollutantID,
    		@RequestParam(value = "LOV_PollutantGroupID", required = false) Integer pollutantGroupID,
    		@RequestParam(value = "MediumCode", required = false) List<MediumCode> mediumCode,
    		@RequestParam(value = "Accidental", required = false) Integer accidental,
    		@RequestParam(value = "ConfidentialIndicator", required = false) Integer confidentialIndicator,
    		@RequestParam(value = "SearchType", required = false) String searchtype,
    		HttpServletResponse response
    		) {
/*
		ReportingYearSearchFilter reportingYearFilter = null;
		if (reportingYear != null) {
			reportingYearFilter = new ReportingYearSearchFilter(reportingYear);
		}*/
		FacilityItemSearchFilter facilityItemSearcFilter = new FacilityItemSearchFilter(facilityReportID,facilityID,reportingYear); 
		ReportingYearSearchFilter reportingYearFilter = new ReportingYearSearchFilter(reportingYear);
		LocationSearchFilter locationFilter = new LocationSearchFilter(countryAreaGroupRepository, countryID, areaGroupID, regionID, rbdID);
		ActivitySearchFilter activityFilter = new ActivitySearchFilter(aiSectorID, aiActivityID, aiSubActivityID, naceSectorID, naceActivityID, naceSubActivityID);
		PollutantSearchFilter pollutantFilter = new PollutantSearchFilter(pollutantID, pollutantGroupID, mediumCode, accidental,confidentialIndicator);
		PollutantreleaseSearchFilter filter = new PollutantreleaseSearchFilter(reportingYearFilter, locationFilter, activityFilter, pollutantFilter, facilityItemSearcFilter);
		
		PollutantreleaseCounts counts = pollutantreleaseSearchRepository.getPollutantreleaseCounts(filter);
		response.setHeader("X-QuantityAir", String.valueOf(counts.getQuantityAir()));
		response.setHeader("X-QuantitySoil", String.valueOf(counts.getQuantitySoil()));
		response.setHeader("X-QuantityWater", String.valueOf(counts.getQuantityWater()));
		
		List<Pollutantrelease> pollutantreleases = pollutantreleaseSearchRepository.getPollutantreleases(filter);
		if(searchtype != null && !searchtype.equals(""))
		{
			List<Integer> foundFacilities = new ArrayList<Integer>(); 
			for(Pollutantrelease po : pollutantreleases)
			{
				if(!foundFacilities.contains(po.getFacilityID()))
				{
					foundFacilities.add(po.getFacilityID());
				}
			}
			response.setHeader("facilitiesCount", String.valueOf(foundFacilities.size()));
			return new DataHelperPollutantRelease().getSubdata(searchtype, pollutantreleases);
		}
		return pollutantreleases;
	}
	
	@RequestMapping("/pollutantreleaseConfidentialityTS")
    public List<PollutantConfidentiality> pollutantreleaseConfidentialityTS(
    		
    		@RequestParam(value = "ReportingYear", required = false) Integer reportingYear,
    		@RequestParam(value = "Medium", required = true) MediumCode medium,

    		/*@RequestParam(value = "FacilityReportID", required = false) Integer facilityReportID,*/
    		@RequestParam(value = "FacilityID", required = false) Integer facilityID,
    		
    		@RequestParam(value = "LOV_CountryID", required = false) Integer countryID,
    		@RequestParam(value = "LOV_AreaGroupID", required = false) Integer areaGroupID,
    		@RequestParam(value = "LOV_NUTSRegionID", required = false) Integer regionID,
    		@RequestParam(value = "LOV_RiverBasinDistrictID", required = false) Integer rbdID,
    		
    		@RequestParam(value = "LOV_IASectorID", required = false) Integer aiSectorID,
    		@RequestParam(value = "LOV_IAActivityID", required = false) Integer aiActivityID,
    		@RequestParam(value = "LOV_IASubActivityID", required = false) Integer aiSubActivityID,
    		@RequestParam(value = "LOV_NACESectorID", required = false) Integer naceSectorID,
    		@RequestParam(value = "LOV_NACEActivityID", required = false) Integer naceActivityID,
    		@RequestParam(value = "LOV_NACESubActivityID", required = false) Integer naceSubActivityID,
    		
    		@RequestParam(value = "LOV_PollutantID", required = false) Integer pollutantID,
    		@RequestParam(value = "LOV_PollutantGroupID", required = false) Integer pollutantGroupID,
    		@RequestParam(value = "MediumCode", required = false) List<MediumCode> mediumCode,
    		@RequestParam(value = "Accidental", required = false) Integer accidental,
    		@RequestParam(value = "ConfidentialIndicator", required = false) Integer confidentialIndicator,
    		@RequestParam(value = "SearchType", required = false) String searchtype,
    		HttpServletResponse response
    		) {

		ReportingYearSearchFilter reportingYearFilter = new ReportingYearSearchFilter(reportingYear);
		FacilityItemSearchFilter facilityItemSearcFilter = new FacilityItemSearchFilter(null,facilityID,reportingYear); 
		LocationSearchFilter locationFilter = new LocationSearchFilter(countryAreaGroupRepository, countryID, areaGroupID, regionID, rbdID);
		ActivitySearchFilter activityFilter = new ActivitySearchFilter(aiSectorID, aiActivityID, aiSubActivityID, naceSectorID, naceActivityID, naceSubActivityID);
		PollutantSearchFilter pollutantFilter = new PollutantSearchFilter(pollutantID, pollutantGroupID, mediumCode, accidental,confidentialIndicator);
		PollutantreleaseSearchFilter filter = new PollutantreleaseSearchFilter(reportingYearFilter, locationFilter, activityFilter, pollutantFilter, facilityItemSearcFilter); 
		
		List<PollutantConfidentiality> pollutantreleasecompare = pollutantreleaseSearchRepository.GetConfidentialTimeSeries(filter, medium);
		return pollutantreleasecompare;
	}

	@RequestMapping("/pollutantreleaseIsConfidential")
    public Boolean pollutantreleaseIsConfidential(
    		
    		@RequestParam(value = "ReportingYear", required = false) Integer reportingYear,
    		
    		@RequestParam(value = "FacilityReportID", required = false) Integer facilityReportID,
    		@RequestParam(value = "FacilityID", required = false) Integer facilityID,

    		@RequestParam(value = "LOV_CountryID", required = false) Integer countryID,
    		@RequestParam(value = "LOV_AreaGroupID", required = false) Integer areaGroupID,
    		@RequestParam(value = "LOV_NUTSRegionID", required = false) Integer regionID,
    		@RequestParam(value = "LOV_RiverBasinDistrictID", required = false) Integer rbdID,
    		
    		@RequestParam(value = "LOV_IASectorID", required = false) Integer aiSectorID,
    		@RequestParam(value = "LOV_IAActivityID", required = false) Integer aiActivityID,
    		@RequestParam(value = "LOV_IASubActivityID", required = false) Integer aiSubActivityID,
    		@RequestParam(value = "LOV_NACESectorID", required = false) Integer naceSectorID,
    		@RequestParam(value = "LOV_NACEActivityID", required = false) Integer naceActivityID,
    		@RequestParam(value = "LOV_NACESubActivityID", required = false) Integer naceSubActivityID,
    		
    		@RequestParam(value = "LOV_PollutantID", required = false) Integer pollutantID,
    		@RequestParam(value = "LOV_PollutantGroupID", required = false) Integer pollutantGroupID,
    		@RequestParam(value = "MediumCode", required = false) List<MediumCode> mediumCode,
    		@RequestParam(value = "Accidental", required = false) Integer accidental,
    		@RequestParam(value = "ConfidentialIndicator", required = false) Integer confidentialIndicator,
    		@RequestParam(value = "SearchType", required = false) String searchtype,
    		HttpServletResponse response
    		) {

		ReportingYearSearchFilter reportingYearFilter = new ReportingYearSearchFilter(reportingYear);
		FacilityItemSearchFilter facilityItemSearcFilter = new FacilityItemSearchFilter(facilityReportID,facilityID,reportingYear); 
		LocationSearchFilter locationFilter = new LocationSearchFilter(countryAreaGroupRepository, countryID, areaGroupID, regionID, rbdID);
		ActivitySearchFilter activityFilter = new ActivitySearchFilter(aiSectorID, aiActivityID, aiSubActivityID, naceSectorID, naceActivityID, naceSubActivityID);
		PollutantSearchFilter pollutantFilter = new PollutantSearchFilter(pollutantID, pollutantGroupID, mediumCode, accidental,confidentialIndicator);
		PollutantreleaseSearchFilter filter = new PollutantreleaseSearchFilter(reportingYearFilter, locationFilter, activityFilter, pollutantFilter, facilityItemSearcFilter); 
		
		Boolean isconfidential = pollutantreleaseSearchRepository.IsAffectedByConfidentiality(filter);
		return isconfidential;
	}
	

	@RequestMapping("/pollutantreleaseAreaoverview")
    public List<ActivityPollutantQuantity> pollutantreleaseAreaoverview(
    		
    		@RequestParam(value = "ReportingYear", required = false) Integer reportingYear,
    		@RequestParam(value = "LOV_CountryID", required = false) Integer countryID,
    		@RequestParam(value = "LOV_AreaGroupID", required = false) Integer areaGroupID,
    		@RequestParam(value = "LOV_NUTSRegionID", required = false) Integer regionID,
    		@RequestParam(value = "LOV_RiverBasinDistrictID", required = false) Integer rbdID,
    		@RequestParam(value = "LOV_PollutantID", required = false) Integer pollutantID,
    		@RequestParam(value = "LOV_PollutantGroupID", required = false) Integer pollutantGroupID,
    		HttpServletResponse response
    		) throws CloneNotSupportedException {
		ReportingYearSearchFilter reportingYearFilter = new ReportingYearSearchFilter(reportingYear);
		LocationSearchFilter locationFilter = new LocationSearchFilter(countryAreaGroupRepository, countryID, areaGroupID, regionID, rbdID);
		ActivitySearchFilter activityFilter = new ActivitySearchFilter(null, null, null, null, null, null);
		PollutantSearchFilter pollutantFilter = new PollutantSearchFilter(pollutantID, pollutantGroupID, null, null,null);
		PollutantreleaseSearchFilter filter = new PollutantreleaseSearchFilter(reportingYearFilter, locationFilter, activityFilter, pollutantFilter, null);
		
		List<Pollutantrelease> pollutantreleases = pollutantreleaseSearchRepository.getPollutantreleases(filter);
		List<LovPollutant> pollist = pollutantSearchRepository.getLovPollutants(new PollutantSearchFilter(null, pollutantGroupID, null, null, null));

		return new DataHelperPollutantRelease().getAreaOverview(pollutantreleases, pollist, pollutantGroupID);
	}

	
	
}
