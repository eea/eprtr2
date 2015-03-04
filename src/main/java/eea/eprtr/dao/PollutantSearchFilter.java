package eea.eprtr.dao;

import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import eea.eprtr.model.FacilitySearchAll;
import eea.eprtr.model.FacilitySearchAll_;
import eea.eprtr.model.Pollutantrelease;
import eea.eprtr.model.Pollutantrelease_;

public class PollutantSearchFilter {

	private Integer pollutantID;
	private Integer pollutantGroupID;
	private List<String> mediumCode;
	private Integer accidental;

	public PollutantSearchFilter(Integer pollutantID, Integer pollutantGroupID, List<String> mediumCode, Integer accidental) {
		this.pollutantID = pollutantID;
		this.pollutantGroupID = pollutantGroupID;
		this.mediumCode = mediumCode;
		this.accidental = accidental;
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
			whereClause.getExpressions().add(cb.not(qr.get(FacilitySearchAll_.mediumCode).in(mediumCode)));
		}
		if (accidental != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(FacilitySearchAll_.accidental), accidental));
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
		return whereClause;
	}
}
