package eea.eprtr.model;

import java.io.Serializable;
import java.util.Objects;

/**
 * 
 * @author Vasilis Skiadas<vs@eworx.gr>
 */
public class FacilitydetailActivityPK implements Serializable {

    protected String activityCode;

    protected Integer facilityReportID;

    public FacilitydetailActivityPK() {
    }

    public FacilitydetailActivityPK(String activityCode, Integer facilityReportID) {
        this.activityCode = activityCode;
        this.facilityReportID = facilityReportID;
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 67 * hash + Objects.hashCode(this.activityCode);
        hash = 67 * hash + Objects.hashCode(this.facilityReportID);
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
        final FacilitydetailActivityPK other = (FacilitydetailActivityPK) obj;
        if (!Objects.equals(this.activityCode, other.activityCode)) {
            return false;
        }
        if (!Objects.equals(this.facilityReportID, other.facilityReportID)) {
            return false;
        }
        return true;
    }

}
