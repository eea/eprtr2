package eea.eprtr.dao;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import eea.eprtr.model.FacilitySearchAll;
import eea.eprtr.model.FacilitySearchAll_;

public class ActivitySearchFilter {

	private Integer aiSectorID;
	private Integer aiActivityID;
	private Integer aiSubActivityID;
	private Integer naceSectorID;
	private Integer naceActivityID;
	private Integer naceSubActivityID;

	public ActivitySearchFilter(Integer aiSectorID, Integer aiActivityID, Integer aiSubActivityID, Integer naceSectorID, Integer naceActivityID, Integer naceSubActivityID) {
		this.aiSectorID = aiSectorID;
		this.aiActivityID = aiActivityID;
		this.aiSubActivityID = aiSubActivityID;
		this.naceSectorID = naceSectorID;
		this.naceActivityID = naceActivityID;
		this.naceSubActivityID = naceSubActivityID;
		
	}
	
	public Predicate buildWhereClause(CriteriaBuilder cb, Root<FacilitySearchAll> qr) {
		Predicate whereClause = cb.conjunction();
		if (aiSectorID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(FacilitySearchAll_.LOV_IASectorID), aiSectorID));
		} else if (aiActivityID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(FacilitySearchAll_.LOV_IAActivityID), aiActivityID));
		} else if (aiSubActivityID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(FacilitySearchAll_.LOV_IASubActivityID), aiSubActivityID));
		} else if (naceSectorID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(FacilitySearchAll_.LOV_NACESectorID), naceSectorID));
		} else if (naceActivityID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(FacilitySearchAll_.LOV_NACEActivityID), naceActivityID));
		} else if (naceSubActivityID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(FacilitySearchAll_.LOV_NACESubActivityID), naceSubActivityID));
		}
		 
		return whereClause;
	}
}
