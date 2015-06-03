package eea.eprtr.model;

public class WasteConfidentialReason {

	private Integer facilities;
	private final String  wasteTypeCode;
	private final String reasonCode;

	public WasteConfidentialReason(Integer facilities, String  wasteTypeCode, String reasonCode) {
		this.facilities = facilities;
		this.wasteTypeCode = wasteTypeCode;
		this.reasonCode = reasonCode;
	}

	public Integer getFacilities() {
		return facilities;
	}
	public void setFacilities(Integer facilities) {
		this.facilities = facilities;
	}

	public String getWasteTypeCode() {
		return wasteTypeCode;
	}

	public String getReasonCode() {
		return reasonCode;
	}


}
