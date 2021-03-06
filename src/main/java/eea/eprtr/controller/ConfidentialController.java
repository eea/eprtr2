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
import eea.eprtr.dao.FacilityItemSearchFilter;
import eea.eprtr.dao.LocationSearchFilter;
import eea.eprtr.dao.PollutantSearchFilter;
import eea.eprtr.dao.PollutantreleaseSearchFilter;
import eea.eprtr.dao.PollutantreleaseSearchRepository;
import eea.eprtr.dao.PollutanttransferSearchFilter;
import eea.eprtr.dao.PollutanttransferSearchRepository;
import eea.eprtr.dao.ReportingYearSearchFilter;
import eea.eprtr.dao.WasteSearchFilter;
import eea.eprtr.dao.WasteTransferConfidentialSearchFilter;
import eea.eprtr.dao.WasteTransferSearchRepository;
import eea.eprtr.dao.WastetransferSearchFilter;
import eea.eprtr.model.MediumCode;
import eea.eprtr.model.Pollutantrelease;
import eea.eprtr.model.Pollutanttransfer;
import eea.eprtr.model.WasteConfidentialReason;
import eea.eprtr.model.Wastetransfer;
import eea.eprtr.model.WastetransferConfidential;
import eea.eprtr.model.WastetransferCounts;

@RestController
public class ConfidentialController {

    @Autowired
    private PollutantreleaseSearchRepository pollutantreleaseSearchRepository;

    @Autowired
    private PollutanttransferSearchRepository pollutanttransferSearchRepository;

    @Autowired
    private WasteTransferSearchRepository wastetransferSearchRepository;

    @Autowired
    private CountryAreaGroupRepository countryAreaGroupRepository;

    @RequestMapping("/confindustrialactivitySearch")
    public List<ConfidentialData> confindustrialactivitySearch(
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

/*      ReportingYearSearchFilter reportingYearFilter = null;
        if (reportingYear != null) {*/
        ReportingYearSearchFilter reportingYearFilter = new ReportingYearSearchFilter(reportingYear);
        //}
        FacilityItemSearchFilter facilityItemSearcFilter = new FacilityItemSearchFilter(facilityReportID,facilityID,reportingYear);
        LocationSearchFilter locationFilter = new LocationSearchFilter(countryAreaGroupRepository, countryID, areaGroupID, regionID, rbdID);
        ActivitySearchFilter activityFilter = new ActivitySearchFilter(aiSectorID, aiActivityID, aiSubActivityID, naceSectorID, naceActivityID, naceSubActivityID);

        confidentialIndicator = 1;
        PollutantSearchFilter pollutantFilter = new PollutantSearchFilter(pollutantID, pollutantGroupID, mediumCode, accidental,confidentialIndicator);

        PollutantreleaseSearchFilter filter = new PollutantreleaseSearchFilter(reportingYearFilter, locationFilter, activityFilter, pollutantFilter,facilityItemSearcFilter);

        List<Pollutantrelease> pollutantreleases = pollutantreleaseSearchRepository.getPollutantreleases(filter);
        List<ConfidentialData> data = new ArrayList<ConfidentialController.ConfidentialData>();
        for(Pollutantrelease po : pollutantreleases)
        {
            ConfidentialData obj = new ConfidentialData();
            obj.pollutantCode = po.getPollutantCode();
            obj.pollutantGroupCode = po.getPollutantGroupCode();
            obj.confidentialCodeAir = po.getConfidentialCodeAir();
            obj.confidentialCodeWater = po.getConfidentialCodeWater();
            obj.confidentialCodeSoil = po.getConfidentialCodeSoil();
            obj.conftype = "polRelease";
            data.add(obj);
        }
        PollutanttransferSearchFilter filter2 = new PollutanttransferSearchFilter(reportingYearFilter, locationFilter, activityFilter, pollutantFilter,facilityItemSearcFilter);
        List<Pollutanttransfer> pollutanttransfer = pollutanttransferSearchRepository.getPollutanttransfer(filter2);
        for(Pollutanttransfer po : pollutanttransfer)
        {
            ConfidentialData obj = new ConfidentialData();
            obj.pollutantCode = po.getPollutantCode();
            obj.pollutantGroupCode = po.getPollutantGroupCode();
            obj.confidentialCode = po.getConfidentialCode();
            obj.conftype = "polTransfer";
            data.add(obj);
        }
        WasteSearchFilter wastefilter = new WasteSearchFilter(1,1,1,1,1,1);
        WastetransferSearchFilter filter3 = new WastetransferSearchFilter(reportingYearFilter, locationFilter, activityFilter,wastefilter,facilityItemSearcFilter);
        List<Wastetransfer> wastetranfer = wastetransferSearchRepository.getWastetransfer(filter3);
        WasteTransferConfidentialSearchFilter filter4  = new WasteTransferConfidentialSearchFilter(reportingYearFilter, null);
        List<WastetransferConfidential> confidentialCodes = wastetransferSearchRepository.getWastetransferConfidentialCodes(filter4);
        for(Wastetransfer PO : wastetranfer)
        {
            ConfidentialData obj = new ConfidentialData();
            // Find type
            String type ="";
            if( PO.isConfidentialIndicatorNONHW())
            {
                type = "NONHW";
            }else if(PO.isConfidentialIndicatorHWIC()){
                type= "HWIC";
            }else if(PO.isConfidentialIndicatorHWOC()){
                type = "HWOC";
            }
            obj.confidentialCode = findCode(confidentialCodes,PO.getFacilityReportID(),type);
            obj.wastetype = type;
            obj.conftype = "wasteTransfer";
            data.add(obj);
        }
        return data;
    }

    @RequestMapping("/wastetransferConfidentialCounts")
    public WastetransferCounts wastetransferConfidentialCounts(
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

            @RequestParam(value = "Accidental", required = false) Integer accidental,
            @RequestParam(value = "ConfidentialIndicator", required = false) Integer confidentialIndicator,
            HttpServletResponse response
            ) {

        ReportingYearSearchFilter reportingYearFilter = new ReportingYearSearchFilter(reportingYear);
        LocationSearchFilter locationFilter = new LocationSearchFilter(countryAreaGroupRepository, countryID, areaGroupID, regionID, rbdID);

        WasteTransferConfidentialSearchFilter filter  = new WasteTransferConfidentialSearchFilter(reportingYearFilter, locationFilter);
        List<WastetransferConfidential> confidentialCodes = wastetransferSearchRepository.getWastetransferConfidentialCodes(filter);

        /*Need to filter result*/
        long _quantityNONHW = (long) 0;
        long _quantityHWIC = (long) 0;
        long _quantityHWOC =(long) 0;
        for(WastetransferConfidential co : confidentialCodes){
            switch (co.getWasteTypeCode()) {
                case "NON-HW":
                    _quantityNONHW ++;
                    break;
                case "NONHW":
                    _quantityNONHW ++;
                    break;
                case "HWOC":
                    _quantityHWOC ++;
                    break;
                case "HWIC":
                    _quantityHWIC ++;
                    break;
                default:
                    break;
            }
        }
        WastetransferCounts result_1 = new WastetransferCounts(_quantityNONHW, _quantityHWIC, _quantityHWOC) ;
        return result_1;
    }

    @RequestMapping("/wastetransferConfidentialReason")
    public List<WasteConfidentialReason> GetWasteConfidentialReason(
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

            @RequestParam(value = "Accidental", required = false) Integer accidental,
            @RequestParam(value = "ConfidentialIndicator", required = false) Integer confidentialIndicator,
            HttpServletResponse response
            ) {

        ReportingYearSearchFilter reportingYearFilter = new ReportingYearSearchFilter(reportingYear);
        LocationSearchFilter locationFilter = new LocationSearchFilter(countryAreaGroupRepository, countryID, areaGroupID, regionID, rbdID);

        WasteTransferConfidentialSearchFilter filter  = new WasteTransferConfidentialSearchFilter(reportingYearFilter, locationFilter);
        List<WastetransferConfidential> confidentialCodes = wastetransferSearchRepository.getWastetransferConfidentialCodes(filter);

        List<WasteConfidentialReason> result_1 = new ArrayList<WasteConfidentialReason>();

        for(WastetransferConfidential co : confidentialCodes){
            Boolean isin = false;
            for(WasteConfidentialReason wr : result_1){
                if (co.getWasteTypeCode().equals(wr.getWasteTypeCode()) && co.getConfidentialCode().equals(wr.getReasonCode())){
                    wr.setFacilities(wr.getFacilities()+1);
                    isin = true;
                }
            }
            if (!isin){
                result_1.add(new WasteConfidentialReason(1, co.getWasteTypeCode(),co.getConfidentialCode()));
            }
        }
        return result_1;
    }

    private String findCode(List<WastetransferConfidential> codes, int reportID, String wastetypeCode)
    {
        for(WastetransferConfidential code: codes)
        {
            if(code.getFacilityReportID() == reportID && code.getWasteTypeCode().equalsIgnoreCase(wastetypeCode))
            {
                return code.getConfidentialCode();
            }
        }
        return "";
    }

    class ConfidentialData
    {
        public String pollutantCode ="";
        public String pollutantGroupCode ="";
        public String confidentialCodeAir="";
        public String confidentialCodeWater="";
        public String confidentialCodeSoil="";
        public String confidentialCode="";
        public String wastetype ="";
        public String conftype="";
        public ConfidentialData()
        {

        }
    }
}
