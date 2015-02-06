package eea.eprtr.controller;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.dao.CountryAreaGroupRepository;
import eea.eprtr.dao.FacilitySearchFilter;
import eea.eprtr.dao.FacilitySearchRepository;
import eea.eprtr.dao.OrderBy;
import eea.eprtr.dao.QueryPager;
import eea.eprtr.model.FacilitySearchMainActivity;

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
    		@RequestParam(value = "offset") Integer offset,
    		@RequestParam(value = "limit") Integer limit,
    		@RequestParam(value = "order") String order,
    		@RequestParam(value = "desc") Boolean desc,
    		HttpServletResponse response) {

		FacilitySearchFilter filter = new FacilitySearchFilter(countryAreaGroupRepository, reportingYear, countryID, areaGroupID);
		
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
