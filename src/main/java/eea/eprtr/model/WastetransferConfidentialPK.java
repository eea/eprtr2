package eea.eprtr.model;

import java.io.Serializable;
import java.util.Objects;

/**
 * 
 * @author Vasilis Skiadas<vs@eworx.gr>
 */
public class WastetransferConfidentialPK implements Serializable {

    protected Integer facilityReportID;

    protected Integer reportingYear;

    public WastetransferConfidentialPK() {
    }

    public WastetransferConfidentialPK(Integer facilityReportID, Integer reportingYear) {
        this.facilityReportID = facilityReportID;
        this.reportingYear = reportingYear;
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 59 * hash + Objects.hashCode(this.facilityReportID);
        hash = 59 * hash + Objects.hashCode(this.reportingYear);
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
        final WastetransferConfidentialPK other = (WastetransferConfidentialPK) obj;
        if (!Objects.equals(this.facilityReportID, other.facilityReportID)) {
            return false;
        }
        if (!Objects.equals(this.reportingYear, other.reportingYear)) {
            return false;
        }
        return true;
    }

}
