package eea.eprtr.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.Util.DataHelperPollutantTransfer;
import eea.eprtr.dao.ActivitySearchFilter;
import eea.eprtr.dao.CountryAreaGroupRepository;
import eea.eprtr.dao.LocationSearchFilter;
import eea.eprtr.dao.PollutantSearchFilter;
import eea.eprtr.dao.PollutantSearchRepository;
import eea.eprtr.model.PollutanttransferCompare;
import eea.eprtr.dao.PollutanttransferSearchFilter;
import eea.eprtr.dao.PollutanttransferSearchRepository;
import eea.eprtr.model.PollutanttransferSeries;
import eea.eprtr.dao.ReportingYearSearchFilter;
import eea.eprtr.model.ActivityPollutantQuantity;
import eea.eprtr.model.LovPollutant;
import eea.eprtr.model.MediumCode;
import eea.eprtr.model.PollutantConfidentiality;
import eea.eprtr.model.Pollutanttransfer;

@RestController
public class PollutanttransferSearchController {

	@Autowired
	private PollutanttransferSearchRepository pollutanttransferSearchRepository;

	@Autowired
	private PollutantSearchRepository pollutantSearchRepository;

	@Autowired
	private CountryAreaGroupRepository countryAreaGroupRepository;
	
	@RequestMapping("/pollutanttransferSearch")
    public List<Pollutanttransfer> pollutanttransferSearch(
    		
    		@RequestParam(value = "ReportingYear", required = false) Integer reportingYear,
    		
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

		/*ReportingYearSearchFilter reportingYearFilter = null;
		if (reportingYear != null) {
			reportingYearFilter = new ReportingYearSearchFilter(reportingYear);
		}*/
		ReportingYearSearchFilter reportingYearFilter = new ReportingYearSearchFilter(reportingYear);
		LocationSearchFilter locationFilter = new LocationSearchFilter(countryAreaGroupRepository, countryID, areaGroupID, regionID, rbdID);
		ActivitySearchFilter activityFilter = new ActivitySearchFilter(aiSectorID, aiActivityID, aiSubActivityID, naceSectorID, naceActivityID, naceSubActivityID);
		PollutantSearchFilter pollutantFilter = new PollutantSearchFilter(pollutantID, pollutantGroupID, mediumCode, accidental,confidentialIndicator);
		PollutanttransferSearchFilter filter = new PollutanttransferSearchFilter(reportingYearFilter, locationFilter, activityFilter, pollutantFilter); 
		
		/*
		PollutantreleaseCounts counts = pollutantreleaseSearchRepository.getPollutantreleaseCounts(filter);
		response.setHeader("X-QuantityAir", String.valueOf(counts.getQuantityAir()));
		response.setHeader("X-QuantitySoil", String.valueOf(counts.getQuantitySoil()));
		response.setHeader("X-QuantityWater", String.valueOf(counts.getQuantityWater()));
		*/
		
		//POLLUTANTTRANSFERSUM
		List<Pollutanttransfer> pollutanttransfers = pollutanttransferSearchRepository.getPollutanttransfer(filter);
		if(searchtype != null && !searchtype.equals(""))
		{
			List<Integer> foundFacilities = new ArrayList<Integer>(); 
			for(Pollutanttransfer po : pollutanttransfers)
			{
				if(!foundFacilities.contains(po.getFacilityID()))
				{
					foundFacilities.add(po.getFacilityID());
				}
			}
			response.setHeader("facilitiesCount", String.valueOf(foundFacilities.size()));
			return new DataHelperPollutantTransfer().getSubdata(searchtype,pollutanttransfers);
		}
		return pollutanttransfers;
	}
	
	@RequestMapping("/pollutanttransferSeries")
    public List<PollutanttransferSeries> pollutanttransferSeries(
    		
    		@RequestParam(value = "ReportingYear", required = false) Integer reportingYear,
    		
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

		//ReportingYearSearchFilter reportingYearFilter = null;
		ReportingYearSearchFilter reportingYearFilter = new ReportingYearSearchFilter(reportingYear);
		LocationSearchFilter locationFilter = new LocationSearchFilter(countryAreaGroupRepository, countryID, areaGroupID, regionID, rbdID);
		ActivitySearchFilter activityFilter = new ActivitySearchFilter(aiSectorID, aiActivityID, aiSubActivityID, naceSectorID, naceActivityID, naceSubActivityID);
		PollutantSearchFilter pollutantFilter = new PollutantSearchFilter(pollutantID, pollutantGroupID, mediumCode, accidental,confidentialIndicator);
		PollutanttransferSearchFilter filter = new PollutanttransferSearchFilter(reportingYearFilter, locationFilter, activityFilter, pollutantFilter); 
		
		List<PollutanttransferSeries> pollutanttransferseries = pollutanttransferSearchRepository.getPollutanttransferSeries(filter);
		return pollutanttransferseries;
	}

	@RequestMapping("/pollutanttransferCompare")
    public List<PollutanttransferCompare> pollutanttransferCompare(
    		
    		@RequestParam(value = "ReportingYearStart", required = true) Integer reportingYearStart,
    		@RequestParam(value = "ReportingYearEnd", required = true) Integer reportingYearEnd,
    		
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

		ReportingYearSearchFilter reportingYearFilter = null;
		LocationSearchFilter locationFilter = new LocationSearchFilter(countryAreaGroupRepository, countryID, areaGroupID, regionID, rbdID);
		ActivitySearchFilter activityFilter = new ActivitySearchFilter(aiSectorID, aiActivityID, aiSubActivityID, naceSectorID, naceActivityID, naceSubActivityID);
		PollutantSearchFilter pollutantFilter = new PollutantSearchFilter(pollutantID, pollutantGroupID, mediumCode, accidental,confidentialIndicator);
		PollutanttransferSearchFilter filter = new PollutanttransferSearchFilter(reportingYearFilter, locationFilter, activityFilter, pollutantFilter); 
		
		List<PollutanttransferCompare> pollutanttransfercompare = pollutanttransferSearchRepository.getPollutanttransferCompare(filter, reportingYearStart, reportingYearEnd);
		return pollutanttransfercompare;
	}

	@RequestMapping("/pollutanttransferConfidentialityTS")
    public List<PollutantConfidentiality> pollutanttransferConfidentialityTS(
    		
    		@RequestParam(value = "ReportingYear", required = false) Integer reportingYear,
    		
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
		LocationSearchFilter locationFilter = new LocationSearchFilter(countryAreaGroupRepository, countryID, areaGroupID, regionID, rbdID);
		ActivitySearchFilter activityFilter = new ActivitySearchFilter(aiSectorID, aiActivityID, aiSubActivityID, naceSectorID, naceActivityID, naceSubActivityID);
		PollutantSearchFilter pollutantFilter = new PollutantSearchFilter(pollutantID, pollutantGroupID, mediumCode, accidental,confidentialIndicator);
		PollutanttransferSearchFilter filter = new PollutanttransferSearchFilter(reportingYearFilter, locationFilter, activityFilter, pollutantFilter); 
		
		List<PollutantConfidentiality> pollutanttransfercompare = pollutanttransferSearchRepository.GetConfidentialTimeSeries(filter);
		return pollutanttransfercompare;
	}

	@RequestMapping("/pollutanttransferIsConfidential")
    public Boolean pollutanttransferIsConfidential(
    		
    		@RequestParam(value = "ReportingYear", required = false) Integer reportingYear,
    		
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
		LocationSearchFilter locationFilter = new LocationSearchFilter(countryAreaGroupRepository, countryID, areaGroupID, regionID, rbdID);
		ActivitySearchFilter activityFilter = new ActivitySearchFilter(aiSectorID, aiActivityID, aiSubActivityID, naceSectorID, naceActivityID, naceSubActivityID);
		PollutantSearchFilter pollutantFilter = new PollutantSearchFilter(pollutantID, pollutantGroupID, mediumCode, accidental,confidentialIndicator);
		PollutanttransferSearchFilter filter = new PollutanttransferSearchFilter(reportingYearFilter, locationFilter, activityFilter, pollutantFilter); 
		
		Boolean isconfidential = pollutanttransferSearchRepository.IsAffectedByConfidentiality(filter);
		return isconfidential;
	}
	
	
	@RequestMapping("/pollutanttransferAreaoverview")
    public List<ActivityPollutantQuantity> pollutanttransferAreaoverview(
    		
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
		PollutanttransferSearchFilter filter = new PollutanttransferSearchFilter(reportingYearFilter, locationFilter, activityFilter, pollutantFilter); 
		
		List<Pollutanttransfer> pollutanttransfers = pollutanttransferSearchRepository.getPollutanttransfer(filter);
		List<LovPollutant> pollist = pollutantSearchRepository.getLovPollutants(new PollutantSearchFilter(null, pollutantGroupID, null, null, null));

		return new DataHelperPollutantTransfer().getAreaOverview(pollutanttransfers, pollist, pollutantGroupID);
	}

	
	
}
