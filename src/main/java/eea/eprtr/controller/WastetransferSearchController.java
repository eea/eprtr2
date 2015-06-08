package eea.eprtr.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.dao.ActivitySearchFilter;
import eea.eprtr.dao.CountryAreaGroupRepository;
import eea.eprtr.dao.LocationSearchFilter;
import eea.eprtr.dao.OrderBy;
import eea.eprtr.dao.QueryPager;
import eea.eprtr.dao.ReportingYearSearchFilter;
import eea.eprtr.dao.WasteSearchFilter;
import eea.eprtr.model.WastetransferCompare;
import eea.eprtr.model.WastetransferCounts;
import eea.eprtr.dao.WastetransferSearchFilter;
import eea.eprtr.dao.WasteTransferSearchRepository;
import eea.eprtr.model.WasteTransferConfidentialTS;
import eea.eprtr.model.WastetransferSeries;
import eea.eprtr.model.MediumCode;
import eea.eprtr.model.WasteType;
import eea.eprtr.model.Wastetransfer;
import eea.eprtr.Util.DataHelperWasteTransfer;

@RestController
public class WastetransferSearchController {

	@Autowired
	private CountryAreaGroupRepository countryAreaGroupRepository;
	
	@Autowired
	private WasteTransferSearchRepository wastetransferSearchrepository;
	
	@RequestMapping("/wastetransferSearch")
    public List<Wastetransfer> wastetransferSearch(
    		
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
    		
    		@RequestParam(value = "WasteTypeCode", required = false) List<String> wasteTypeCode,
    		@RequestParam(value = "WasteTreatmentCode", required = false) List<String> wasteTreatmentCode,
    		@RequestParam(value = "WHPCountryID", required = false) Integer whpCountryID,
    		
    		@RequestParam(value = "ConfidentialIndicator", required = false) Integer confidentialIndicator,
    		
    		@RequestParam(value = "SearchType", required = false) String searchtype,
    		
    		@RequestParam(value = "RegionSearch", required = false) boolean regionsearch,

    		@RequestParam(value = "offset", required = false) Integer offset,
    		@RequestParam(value = "limit", required = false) Integer limit,
    		@RequestParam(value = "order", required = false) String order,
    		@RequestParam(value = "desc", required = false) Boolean desc,
    		
    		HttpServletResponse response
    		){
		
	/*	ReportingYearSearchFilter reportingYearFilter = null;
		if (reportingYear != null) {
			reportingYearFilter = new ReportingYearSearchFilter(reportingYear);
		}*/
		ReportingYearSearchFilter reportingYearFilter = new ReportingYearSearchFilter(reportingYear);
		LocationSearchFilter locationFilter = new LocationSearchFilter(countryAreaGroupRepository, countryID, areaGroupID, regionID, rbdID);
		ActivitySearchFilter activityFilter = new ActivitySearchFilter(aiSectorID, aiActivityID, aiSubActivityID, naceSectorID, naceActivityID, naceSubActivityID);
		WasteSearchFilter wastefilter = new WasteSearchFilter(wasteTypeCode, wasteTreatmentCode, whpCountryID, confidentialIndicator);
		WastetransferSearchFilter filter = new WastetransferSearchFilter(reportingYearFilter, locationFilter, activityFilter,wastefilter);

		List<Wastetransfer> wastetranfer = null;
		if(order != null && !order.equals("") && desc != null && offset != null && limit != null){
			OrderBy orderBy = new OrderBy(order, desc.booleanValue());
			QueryPager pager = new QueryPager(offset.intValue(), limit.intValue());
			wastetranfer = wastetransferSearchrepository.getWastetransfer(filter, orderBy, pager);
			long facilitiesCount = wastetransferSearchrepository.getFacilityCount(filter);
			response.setHeader("X-Count", String.valueOf(facilitiesCount));
		}
		else{
			wastetranfer = wastetransferSearchrepository.getWastetransfer(filter);
		}
		if(searchtype != null && !searchtype.equals(""))
		{
			List<Integer> foundFacilities = new ArrayList<Integer>(); 
			for(Wastetransfer po : wastetranfer)
			{
				if(!foundFacilities.contains(po.getFacilityID()))
				{
					foundFacilities.add(po.getFacilityID());
				}
			}
			response.setHeader("facilitiesCount", String.valueOf(foundFacilities.size()));
			return new DataHelperWasteTransfer().getSubdata(searchtype, wastetranfer,regionsearch);
			
		}
		return wastetranfer;
	}

	@RequestMapping("/wastetransferCounts")
    public WastetransferCounts wastetransferCounter(
    		
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
    		
    		@RequestParam(value = "WasteTypeCode", required = false) List<String> wasteTypeCode,
    		@RequestParam(value = "WasteTreatmentCode", required = false) List<String> wasteTreatmentCode,
    		@RequestParam(value = "WHPCountryID", required = false) Integer whpCountryID,
    		
    		@RequestParam(value = "ConfidentialIndicator", required = false) Integer confidentialIndicator,
    		
    		@RequestParam(value = "SearchType", required = false) String searchtype,
    		
    		@RequestParam(value = "RegionSearch", required = false) boolean regionsearch,
    		
    		HttpServletResponse response
    		){
		
		/*ReportingYearSearchFilter reportingYearFilter = null;
		if (reportingYear != null) {
			reportingYearFilter = new ReportingYearSearchFilter(reportingYear);
		}*/
		ReportingYearSearchFilter reportingYearFilter = new ReportingYearSearchFilter(reportingYear);
		LocationSearchFilter locationFilter = new LocationSearchFilter(countryAreaGroupRepository, countryID, areaGroupID, regionID, rbdID);
		ActivitySearchFilter activityFilter = new ActivitySearchFilter(aiSectorID, aiActivityID, aiSubActivityID, naceSectorID, naceActivityID, naceSubActivityID);
		WasteSearchFilter wastefilter = new WasteSearchFilter(wasteTypeCode, wasteTreatmentCode, whpCountryID, confidentialIndicator);
		WastetransferSearchFilter filter = new WastetransferSearchFilter(reportingYearFilter, locationFilter, activityFilter,wastefilter);
		
		WastetransferCounts wastetranfercounts = wastetransferSearchrepository.getWastetransferCounts(filter);
		
		return wastetranfercounts;
	}

	@RequestMapping("/wastetransferSeries")
    public List<WastetransferSeries> wastetransferSeries(
    		
    		@RequestParam(value = "WasteType", required = true) WasteType wastetype,
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
    		
    		@RequestParam(value = "WasteTypeCode", required = false) List<String> wasteTypeCode,
    		@RequestParam(value = "WasteTreatmentCode", required = false) List<String> wasteTreatmentCode,
    		@RequestParam(value = "WHPCountryID", required = false) Integer whpCountryID,
    		
    		@RequestParam(value = "ConfidentialIndicator", required = false) Integer confidentialIndicator,
    		
    		@RequestParam(value = "SearchType", required = false) String searchtype,
    		
    		@RequestParam(value = "RegionSearch", required = false) boolean regionsearch,
    		
    		HttpServletResponse response
    		){
		
	/*	ReportingYearSearchFilter reportingYearFilter = null;
		if (reportingYear != null) {
			reportingYearFilter = new ReportingYearSearchFilter(reportingYear);
		}*/
		ReportingYearSearchFilter reportingYearFilter = new ReportingYearSearchFilter(reportingYear);
		LocationSearchFilter locationFilter = new LocationSearchFilter(countryAreaGroupRepository, countryID, areaGroupID, regionID, rbdID);
		ActivitySearchFilter activityFilter = new ActivitySearchFilter(aiSectorID, aiActivityID, aiSubActivityID, naceSectorID, naceActivityID, naceSubActivityID);
		WasteSearchFilter wastefilter = new WasteSearchFilter(wasteTypeCode, wasteTreatmentCode, whpCountryID, confidentialIndicator);
		WastetransferSearchFilter filter = new WastetransferSearchFilter(reportingYearFilter, locationFilter, activityFilter,wastefilter);
		
		List<WastetransferSeries> wastetranferseries = wastetransferSearchrepository.getWastetransferSeries(filter, wastetype);
		
		return wastetranferseries;
	}

	@RequestMapping("/wastetransferCompare")
    public List<WastetransferCompare> wastetransferCompare(
    		
    		@RequestParam(value = "ReportingYearStart", required = true) Integer reportingYearStart,
    		@RequestParam(value = "ReportingYearEnd", required = true) Integer reportingYearEnd,
    		@RequestParam(value = "WasteType", required = true) WasteType wastetype,
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
    		
    		@RequestParam(value = "WasteTypeCode", required = false) List<String> wasteTypeCode,
    		@RequestParam(value = "WasteTreatmentCode", required = false) List<String> wasteTreatmentCode,
    		@RequestParam(value = "WHPCountryID", required = false) Integer whpCountryID,
    		
    		@RequestParam(value = "ConfidentialIndicator", required = false) Integer confidentialIndicator,
    		
    		@RequestParam(value = "SearchType", required = false) String searchtype,
    		
    		@RequestParam(value = "RegionSearch", required = false) boolean regionsearch,
    		
    		HttpServletResponse response
    		){
		/*
		ReportingYearSearchFilter reportingYearFilter = null;
		if (reportingYear != null) {
			reportingYearFilter = new ReportingYearSearchFilter(reportingYear);
		}*/
		ReportingYearSearchFilter reportingYearFilter = null;//new ReportingYearSearchFilter(reportingYear);
		LocationSearchFilter locationFilter = new LocationSearchFilter(countryAreaGroupRepository, countryID, areaGroupID, regionID, rbdID);
		ActivitySearchFilter activityFilter = new ActivitySearchFilter(aiSectorID, aiActivityID, aiSubActivityID, naceSectorID, naceActivityID, naceSubActivityID);
		WasteSearchFilter wastefilter = new WasteSearchFilter(wasteTypeCode, wasteTreatmentCode, whpCountryID, confidentialIndicator);
		WastetransferSearchFilter filter = new WastetransferSearchFilter(reportingYearFilter, locationFilter, activityFilter,wastefilter);
		
		List<WastetransferCompare> wastetranfercompare = wastetransferSearchrepository.getWastetransferCompare(filter, reportingYearStart, reportingYearEnd, wastetype);
		
		return wastetranfercompare;
	}

	@RequestMapping("/wastetransferConfidentialTS")
    public List<WasteTransferConfidentialTS> wastetransferConfidentialTS(
    		
    		@RequestParam(value = "WasteType", required = true) WasteType wastetype,
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
    		
    		@RequestParam(value = "WasteTypeCode", required = false) List<String> wasteTypeCode,
    		@RequestParam(value = "WasteTreatmentCode", required = false) List<String> wasteTreatmentCode,
    		@RequestParam(value = "WHPCountryID", required = false) Integer whpCountryID,
    		
    		@RequestParam(value = "ConfidentialIndicator", required = false) Integer confidentialIndicator,
    		
    		@RequestParam(value = "SearchType", required = false) String searchtype,
    		
    		@RequestParam(value = "RegionSearch", required = false) boolean regionsearch,
    		
    		HttpServletResponse response
    		){
		
		/*ReportingYearSearchFilter reportingYearFilter = null;
		if (reportingYear != null) {
			reportingYearFilter = new ReportingYearSearchFilter(reportingYear);
		}*/
		ReportingYearSearchFilter reportingYearFilter = new ReportingYearSearchFilter(reportingYear);
		LocationSearchFilter locationFilter = new LocationSearchFilter(countryAreaGroupRepository, countryID, areaGroupID, regionID, rbdID);
		ActivitySearchFilter activityFilter = new ActivitySearchFilter(aiSectorID, aiActivityID, aiSubActivityID, naceSectorID, naceActivityID, naceSubActivityID);
		WasteSearchFilter wastefilter = new WasteSearchFilter(wasteTypeCode, wasteTreatmentCode, whpCountryID, confidentialIndicator);
		WastetransferSearchFilter filter = new WastetransferSearchFilter(reportingYearFilter, locationFilter, activityFilter,wastefilter);
		
		List<WasteTransferConfidentialTS> wastetranferconfidentialts = wastetransferSearchrepository.getWasteTransferConfidentialTS(filter, wastetype);
		
		return wastetranferconfidentialts;
	}

	
	@RequestMapping("/wastetransferIsConfidential")
    public Boolean wastetransferIsConfidential(
    		
    		@RequestParam(value = "WasteType", required = false) WasteType wastetype,
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
    		
    		@RequestParam(value = "WasteTypeCode", required = false) List<String> wasteTypeCode,
    		@RequestParam(value = "WasteTreatmentCode", required = false) List<String> wasteTreatmentCode,
    		@RequestParam(value = "WHPCountryID", required = false) Integer whpCountryID,
    		
    		@RequestParam(value = "ConfidentialIndicator", required = false) Integer confidentialIndicator,
    		
    		@RequestParam(value = "SearchType", required = false) String searchtype,
    		
    		@RequestParam(value = "RegionSearch", required = false) boolean regionsearch,
    		
    		HttpServletResponse response
    		){
		
		/*ReportingYearSearchFilter reportingYearFilter = null;
		if (reportingYear != null) {
			reportingYearFilter = new ReportingYearSearchFilter(reportingYear);
		}*/
		ReportingYearSearchFilter reportingYearFilter = new ReportingYearSearchFilter(reportingYear);
		LocationSearchFilter locationFilter = new LocationSearchFilter(countryAreaGroupRepository, countryID, areaGroupID, regionID, rbdID);
		ActivitySearchFilter activityFilter = new ActivitySearchFilter(aiSectorID, aiActivityID, aiSubActivityID, naceSectorID, naceActivityID, naceSubActivityID);
		WasteSearchFilter wastefilter = new WasteSearchFilter(wasteTypeCode, wasteTreatmentCode, whpCountryID, confidentialIndicator);
		WastetransferSearchFilter filter = new WastetransferSearchFilter(reportingYearFilter, locationFilter, activityFilter,wastefilter);
		
		Boolean isConfidential = wastetransferSearchrepository.isConfidential(filter, wastetype);
		
		return isConfidential;
	}

}

