package eea.eprtr.model;

import java.io.Serializable;

public class CountryAreaGroupID implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	private int LOV_AreaGroupID;
	private int LOV_CountryID;
	
	public int getLOV_AreaGroupID() {
		return LOV_AreaGroupID;
	}

	public void setLOV_AreaGroupID(int lOV_AreaGroupID) {
		LOV_AreaGroupID = lOV_AreaGroupID;
	}

	public int getLOV_CountryID() {
		return LOV_CountryID;
	}

	public void setLOV_CountryID(int lOV_CountryID) {
		LOV_CountryID = lOV_CountryID;
	}
	
	@Override
	public boolean equals(Object obj) {
		if (obj instanceof CountryAreaGroupID) {
			CountryAreaGroupID other = (CountryAreaGroupID) obj;
			return LOV_AreaGroupID == other.LOV_AreaGroupID && LOV_CountryID == other.LOV_CountryID;
		}
		return false;
	}
	
	@Override
	public int hashCode() {
		return 13 * LOV_AreaGroupID + LOV_CountryID;
	}
}
