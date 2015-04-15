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
import eea.eprtr.dao.PollutantSearchFilter;
import eea.eprtr.dao.PollutantreleaseCounts;
import eea.eprtr.dao.PollutantreleaseSearchFilter;
import eea.eprtr.dao.PollutantreleaseSearchRepository;
import eea.eprtr.dao.ReportingYearSearchFilter;
import eea.eprtr.model.MediumCode;

@RestController
public class PollutantreleaseCounterController {

	@Autowired
	private PollutantreleaseSearchRepository pollutantreleaseSearchRepository;

	@Autowired
	private CountryAreaGroupRepository countryAreaGroupRepository;

	@RequestMapping("/pollutantreleasecounts")
    public PollutantreleaseCounts pollutantreleaseSearch(
//	public List<PollutantreleaseCompare> getPollutantreleaseCompare(PollutantreleaseSearchFilter filter, Integer reportingYearStart, Integer reportingYearEnd, MediumCode medium){

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
    		@RequestParam(value = "ConfidentialIndicator", required = false) Integer confidentialIndicator,
    		HttpServletResponse response
    		) {

		ReportingYearSearchFilter reportingYearFilter = null;
		if (reportingYear != null) {
			reportingYearFilter = new ReportingYearSearchFilter(reportingYear);
		}
		LocationSearchFilter locationFilter = new LocationSearchFilter(countryAreaGroupRepository, countryID, areaGroupID, regionID, rbdID);
		ActivitySearchFilter activityFilter = new ActivitySearchFilter(aiSectorID, aiActivityID, aiSubActivityID, naceSectorID, naceActivityID, naceSubActivityID);
		PollutantSearchFilter pollutantFilter = new PollutantSearchFilter(pollutantID, pollutantGroupID, mediumCode, accidental,confidentialIndicator);
		PollutantreleaseSearchFilter filter = new PollutantreleaseSearchFilter(reportingYearFilter, locationFilter, activityFilter, pollutantFilter);
		
		PollutantreleaseCounts counts = pollutantreleaseSearchRepository.getPollutantreleaseCounts(filter);
		return counts;
	}
}
