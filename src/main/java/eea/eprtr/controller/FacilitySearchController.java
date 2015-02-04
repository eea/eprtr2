package eea.eprtr.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.dao.FacilitySearchFilter;
import eea.eprtr.dao.FacilitySearchRepository;
import eea.eprtr.model.FacilitySearchMainActivity;

@RestController
public class FacilitySearchController {

	@Autowired
	private FacilitySearchRepository repository;
	
	@RequestMapping("/facilitySearch")
    public FacilitySearchMainActivity[] facilitySearch(
    		@RequestParam("ReportingYear") Integer reportingYear,
    		@RequestParam(value = "LOV_CountryID", required = false) Integer countryID,
    		@RequestParam(value = "AreaGroupID", required = false) Integer areaGroupID) {
		
		FacilitySearchFilter filter = new FacilitySearchFilter(reportingYear);
		
		long facilitiesCount = repository.getFacilityCount(filter);
		if (facilitiesCount > 0) {
			List<FacilitySearchMainActivity> facilities = repository.getFacilities(filter);
			return facilities.toArray(new FacilitySearchMainActivity[0]);
		}
		
		return new FacilitySearchMainActivity[0];
    }
}
