package eea.eprtr.controller;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.dao.ActivitySearchFilter;
import eea.eprtr.dao.CountryAreaGroupRepository;
import eea.eprtr.dao.LocationSearchFilter;
import eea.eprtr.dao.ReportingYearSearchFilter;
import eea.eprtr.dao.WasteSearchFilter;
import eea.eprtr.dao.WastetransferSearchFilter;
import eea.eprtr.dao.WasteTransferSearchRepository;
import eea.eprtr.model.MediumCode;
import eea.eprtr.model.Wastetransfer;
import eea.eprtr.Util.DataHelper;

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
    		
    		@RequestParam(value = "ConfidentialIndicator", required = false) Integer confidentialIndicator,
    		
    		@RequestParam(value = "SearchType", required = false) String searchtype,
    		
    		@RequestParam(value = "RegionSearch", required = false) boolean regionsearch,
    		
    		HttpServletResponse response
    		){
		
		ReportingYearSearchFilter reportingYearFilter = null;
		if (reportingYear != null) {
			reportingYearFilter = new ReportingYearSearchFilter(reportingYear);
		}
		LocationSearchFilter locationFilter = new LocationSearchFilter(countryAreaGroupRepository, countryID, areaGroupID, regionID, rbdID);
		ActivitySearchFilter activityFilter = new ActivitySearchFilter(aiSectorID, aiActivityID, aiSubActivityID, naceSectorID, naceActivityID, naceSubActivityID);
		WasteSearchFilter wastefilter = new WasteSearchFilter(wasteTypeCode, wasteTreatmentCode, whpCountryID);
		WastetransferSearchFilter filter = new WastetransferSearchFilter(reportingYearFilter, locationFilter, activityFilter,wastefilter);
		List<Wastetransfer> wastetranfer = wastetransferSearchrepository.getWastetransfer(filter);
		
		if(searchtype != null && searchtype != "")
		{
			return new DataHelper().getSubdata(searchtype, wastetranfer,regionsearch);
		}
		return wastetranfer;
	}
		
}

