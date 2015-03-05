package eea.eprtr.controller;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.dao.ActivitySearchFilter;
import eea.eprtr.dao.CountryAreaGroupRepository;
import eea.eprtr.dao.FacilitySearchFilter;
import eea.eprtr.dao.FacilitySearchRepository;
import eea.eprtr.dao.LocationSearchFilter;
import eea.eprtr.dao.OrderBy;
import eea.eprtr.dao.PollutantSearchFilter;
import eea.eprtr.dao.QueryPager;
import eea.eprtr.dao.ReportingYearSearchFilter;
import eea.eprtr.dao.WasteSearchFilter;
import eea.eprtr.model.FacilitySearchMainActivity;
import eea.eprtr.model.MediumCode;

@RestController
public class FacilitySearchController {
	
	@Autowired
	private FacilitySearchRepository facilitySearchRepository;
	
	@Autowired
	private CountryAreaGroupRepository countryAreaGroupRepository;
	
	@RequestMapping("/facilitySearch")
    public FacilitySearchMainActivity[] facilitySearch(
    		
    		@RequestParam(value = "ReportingYear") Integer reportingYear,
    		
    		@RequestParam(value = "LOV_CountryID", required = false) Integer countryID,
    		@RequestParam(value = "LOV_AreaGroupID", required = false) Integer areaGroupID,
    		@RequestParam(value = "LOV_NUTSRegionID", required = false) Integer regionID,
    		@RequestParam(value = "LOV_RiverBasinDistrictID", required = false) Integer rbdID,
    		
    		@RequestParam(value = "FacilityName", required = false) String facilityName,
    		@RequestParam(value = "CityName", required = false) String cityName,
    		
    		@RequestParam(value = "LOV_AISectorID", required = false) Integer aiSectorID,
    		@RequestParam(value = "LOV_AIActivityID", required = false) Integer aiActivityID,
    		@RequestParam(value = "LOV_AISubActivityID", required = false) Integer aiSubActivityID,
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
    		
    		@RequestParam(value = "offset") Integer offset,
    		@RequestParam(value = "limit") Integer limit,
    		@RequestParam(value = "order") String order,
    		@RequestParam(value = "desc") Boolean desc,
    		
    		HttpServletResponse response) {

		ReportingYearSearchFilter reportingYearFilter = new ReportingYearSearchFilter(reportingYear);
		LocationSearchFilter locationFilter = new LocationSearchFilter(countryAreaGroupRepository, countryID, areaGroupID, regionID, rbdID);
		ActivitySearchFilter activityFilter = new ActivitySearchFilter(aiSectorID, aiActivityID, aiSubActivityID, naceSectorID, naceActivityID, naceSubActivityID);
		PollutantSearchFilter pollutantFilter = new PollutantSearchFilter(pollutantID, pollutantGroupID, mediumCode, accidental);
		WasteSearchFilter wasteFilter = new WasteSearchFilter(wasteTypeCode, wasteTreatmentCode, whpCountryID);
		FacilitySearchFilter filter = new FacilitySearchFilter(facilityName, cityName, reportingYearFilter, locationFilter, activityFilter, pollutantFilter, wasteFilter);
		
		long facilitiesWithConfidentialityCount = facilitySearchRepository.getFacilityCount(filter.createConfidentialityFilter());
		response.setHeader("X-Confidentiality", String.valueOf(facilitiesWithConfidentialityCount > 0));
		
		long facilitiesCount = facilitySearchRepository.getFacilityCount(filter);
		response.setHeader("X-Count", String.valueOf(facilitiesCount));
		
		if (facilitiesCount > 0) {
			OrderBy orderBy = new OrderBy(order, desc.booleanValue());
			QueryPager pager = new QueryPager(offset.intValue(), limit.intValue());
			List<FacilitySearchMainActivity> facilities = facilitySearchRepository.getFacilities(filter, orderBy, pager);
			return facilities.toArray(new FacilitySearchMainActivity[0]);
		}
		
		return new FacilitySearchMainActivity[0];
    }
}
