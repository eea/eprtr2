package eea.eprtr.model;

import java.io.Serializable;
import java.util.Objects;

/**
 *
 * @author Vasilis Skiadas<vs@eworx.gr>
 */
public class FacilitydetailPollutanttransferPK implements Serializable {

    protected int facilityReportID;

    protected Integer LOV_PollutantID;

    public FacilitydetailPollutanttransferPK() {
    }

    public FacilitydetailPollutanttransferPK(int facilityReportID, Integer LOV_PollutantID) {
        this.facilityReportID = facilityReportID;
        this.LOV_PollutantID = LOV_PollutantID;
    }

    @Override
    public int hashCode() {
        int hash = 3;
        hash = 67 * hash + this.facilityReportID;
        hash = 67 * hash + Objects.hashCode(this.LOV_PollutantID);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final FacilitydetailPollutanttransferPK other = (FacilitydetailPollutanttransferPK) obj;
        if (this.facilityReportID != other.facilityReportID) {
            return false;
        }
        if (!Objects.equals(this.LOV_PollutantID, other.LOV_PollutantID)) {
            return false;
        }
        return true;
    }

}
