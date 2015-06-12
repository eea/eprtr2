package eea.eprtr.model;

public class FacilityCounts {
	private final long facilityCount;
	private final long facilityAccidentalCount;

	public FacilityCounts(long facilityCount, long facilityAccidentalCount) {
		this.facilityCount = facilityCount;
		this.facilityAccidentalCount = facilityAccidentalCount;
	}

	public long getFacilityCount() {
		return facilityCount;
	}

	public long getFacilityAccidentalCount() {
		return facilityAccidentalCount;
	}


}
