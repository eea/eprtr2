package eea.eprtr.model;

import java.io.Serializable;
import java.util.Objects;

/**
 *
 * @author Vasilis Skiadas<vs@eworx.gr>
 */
public class FacilitydetailWastetransferPK implements Serializable {

    protected Integer facilityReportID;

    protected Integer wasteTransferID;

    public FacilitydetailWastetransferPK() {
    }

    public FacilitydetailWastetransferPK(Integer facilityReportID, Integer wasteTransferID) {
        this.facilityReportID = facilityReportID;
        this.wasteTransferID = wasteTransferID;
    }

    @Override
    public int hashCode() {
        int hash = 5;
        hash = 71 * hash + Objects.hashCode(this.facilityReportID);
        hash = 71 * hash + Objects.hashCode(this.wasteTransferID);
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
        final FacilitydetailWastetransferPK other = (FacilitydetailWastetransferPK) obj;
        if (!Objects.equals(this.facilityReportID, other.facilityReportID)) {
            return false;
        }
        if (!Objects.equals(this.wasteTransferID, other.wasteTransferID)) {
            return false;
        }
        return true;
    }

}
