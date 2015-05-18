package eea.eprtr.dao;

import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import eea.eprtr.model.FacilitySearchAll;
import eea.eprtr.model.FacilitySearchAll_;
import eea.eprtr.model.LovPollutant;
import eea.eprtr.model.LovPollutant_;
import eea.eprtr.model.MediumCode;
import eea.eprtr.model.Pollutantrelease;
import eea.eprtr.model.Pollutantrelease_;
import eea.eprtr.model.Pollutanttransfer;
import eea.eprtr.model.Pollutanttransfer_;

public class PollutantSearchFilter {

	private Integer pollutantID;
	private Integer pollutantGroupID;
	private List<MediumCode> mediumCode;
	private Integer accidental;
	private Integer confidentialIndicator;

	public PollutantSearchFilter(Integer pollutantID, Integer pollutantGroupID, List<MediumCode> mediumCode, Integer accidental, Integer confidentialIndicator) {
		this.pollutantID = pollutantID;
		this.pollutantGroupID = pollutantGroupID;
		this.mediumCode = mediumCode;
		this.accidental = accidental;
		this.confidentialIndicator = confidentialIndicator;
	}
	
	public Integer getPollutantID() {
		return pollutantID;
	}

	public void setPollutantID(Integer pollutantID) {
		this.pollutantID = pollutantID;
	}
	public Integer getPollutantGroupID() {
		return pollutantGroupID;
	}

	public void setPollutantGroupID(Integer pollutantGroupID) {
		this.pollutantGroupID = pollutantGroupID;
	}
	public List<MediumCode> getMediumCode() {
		return mediumCode;
	}

	public void setMediumCode(List<MediumCode> mediumCode) {
		this.mediumCode = mediumCode;
	}
	public Integer getAccidental() {
		return accidental;
	}

	public void setAccidental(Integer accidental) {
		this.accidental = accidental;
	}
	public Integer getConfidentialIndicator() {
		return confidentialIndicator;
	}

	public void setConfidentialIndicator(Integer confidentialIndicator) {
		this.confidentialIndicator = confidentialIndicator;
	}
	
	
	public Predicate buildWhereClause(CriteriaBuilder cb, Root<FacilitySearchAll> qr) {
		Predicate whereClause = cb.conjunction();
		if (pollutantID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(FacilitySearchAll_.LOV_PollutantID), pollutantID));
		}
		if (pollutantGroupID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(FacilitySearchAll_.LOV_PollutantGroupID), pollutantGroupID));
		}
		if (mediumCode != null) {
			//whereClause.getExpressions().add(cb.not(qr.get(FacilitySearchAll_.mediumCode).in(mediumCode)));
			whereClause.getExpressions().add(qr.get(FacilitySearchAll_.mediumCode).in(mediumCode));
		}
		if (accidental != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(FacilitySearchAll_.accidental), accidental));
		}
		if(confidentialIndicator != null)
		{
			whereClause.getExpressions().add(cb.equal(qr.get(FacilitySearchAll_.confidentialIndicator), confidentialIndicator));
		}
		 
		return whereClause;
	}
	
	public Predicate buildWhereClausePollutantrelease(CriteriaBuilder cb, Root<Pollutantrelease> qr) {
		Predicate whereClause = cb.conjunction();
		if (pollutantID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(Pollutantrelease_.LOV_PollutantID), pollutantID));
		}
		if (pollutantGroupID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(Pollutantrelease_.LOV_PollutantGroupID), pollutantGroupID));
		}
		if(confidentialIndicator != null)
		{
			whereClause.getExpressions().add(cb.equal(qr.get(Pollutantrelease_.confidentialIndicator), confidentialIndicator));
		}
		
		if (mediumCode != null) {
			/*ArrayList<MediumCode> codes = new ArrayList<MediumCode>(Arrays.asList(mediumCode.values()));
			codes.removeAll(mediumCode);*/
			Predicate mediumCodesWhereClause = cb.disjunction();
			for (MediumCode code : mediumCode) {
				switch (code) {
				case AIR:
					mediumCodesWhereClause.getExpressions().add(qr.get(Pollutantrelease_.quantityAir).isNotNull());
					break;
				case SOIL:
					mediumCodesWhereClause.getExpressions().add(qr.get(Pollutantrelease_.quantitySoil).isNotNull());
					break;
				case WATER:
					mediumCodesWhereClause.getExpressions().add(qr.get(Pollutantrelease_.quantityWater).isNotNull());
					break;
				default:
				}
			}
			if (mediumCodesWhereClause.getExpressions().size() > 0) {
				whereClause.getExpressions().add(mediumCodesWhereClause);
			} else {
				whereClause.getExpressions().add(cb.or());
			}
		}
		return whereClause;
	}
	
	public Predicate buildWhereClausePollutanttransfer(CriteriaBuilder cb, Root<Pollutanttransfer> qr) {
		Predicate whereClause = cb.conjunction();
		if (pollutantID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(Pollutanttransfer_.LOV_PollutantID), pollutantID));
		}
		if (pollutantGroupID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(Pollutanttransfer_.LOV_PollutantGroupID), pollutantGroupID));
		}
		if(confidentialIndicator != null)
		{
			whereClause.getExpressions().add(cb.equal(qr.get(Pollutanttransfer_.confidentialIndicator), confidentialIndicator));
		}
		return whereClause;
	}
	
	public Predicate buildWhereClauseLOVPollutant(CriteriaBuilder cb, Root<LovPollutant> qr) {
		Predicate whereClause = cb.conjunction();
		if (pollutantID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(LovPollutant_.LOV_PollutantID), pollutantID));
		}
		if (pollutantGroupID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(LovPollutant_.parentID), pollutantGroupID));
		}
		return whereClause;
	}

}
