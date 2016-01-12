package eea.eprtrcms.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.springframework.stereotype.Repository;

import eea.eprtrcms.model.SurveyItems;
import eea.eprtrcms.model.SurveyItems_;
import eea.eprtrcms.model.SurveyMaster;

@Repository
public class SurveyMasterRepository {
	
	@PersistenceContext(unitName="eprtrcms")
    private EntityManager emcms;
		
	public List<SurveyMaster> getSurveyQuestions() {
		/**
		 * Requesting SurveyMaster 
		 */
		CriteriaBuilder cb1 = emcms.getCriteriaBuilder();
		CriteriaQuery<SurveyMaster> cq1 = cb1.createQuery(SurveyMaster.class);
		Root<SurveyMaster> qr1 = cq1.from(SurveyMaster.class);
		cq1.select(qr1).distinct(true);

		TypedQuery<SurveyMaster> q1 = emcms.createQuery(cq1);
		List<SurveyMaster> surveyMaster = q1.getResultList();

		/**
		 * Requesting SurveyItems
		 */
		if(!surveyMaster.isEmpty()){
			for (SurveyMaster sm: surveyMaster){

				CriteriaBuilder cb2 = emcms.getCriteriaBuilder();
				CriteriaQuery<SurveyItems> cq2 = cb2.createQuery(SurveyItems.class);
				Root<SurveyItems> qr2 = cq2.from(SurveyItems.class);
				cq2.select(qr2).distinct(true);
				cq2.where(cb2.equal(qr2.get(SurveyItems_.fkSurveyID), sm.getSurveyID()));
				
				TypedQuery<SurveyItems> q2 = emcms.createQuery(cq2);
				sm.setSurveyItems(q2.getResultList());
			}
		}

		return surveyMaster;
	}

}
