package eea.eprtr.model;

import java.io.Serializable;
import java.util.Objects;

/**
 *
 * @author Vasilis Skiadas<vs@eworx.gr>
 */
public class PollutantreleasePK implements Serializable {

    protected Integer facilityReportID;

    protected Integer LOV_PollutantID;

    public PollutantreleasePK() {
    }

    public PollutantreleasePK(Integer facilityReportID, Integer LOV_PollutantID) {
        this.facilityReportID = facilityReportID;
        this.LOV_PollutantID = LOV_PollutantID;
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 59 * hash + Objects.hashCode(this.facilityReportID);
        hash = 59 * hash + Objects.hashCode(this.LOV_PollutantID);
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
        final PollutantreleasePK other = (PollutantreleasePK) obj;
        if (!Objects.equals(this.facilityReportID, other.facilityReportID)) {
            return false;
        }
        if (!Objects.equals(this.LOV_PollutantID, other.LOV_PollutantID)) {
            return false;
        }
        return true;
    }

}
