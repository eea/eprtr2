package eea.eprtrcms.dao;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.stereotype.Repository;

import eea.eprtrcms.model.SurveyResults;

@Transactional("tmEprtrCms")
@Repository
public class SurveyResultsRepository {

	@PersistenceContext(unitName="eprtrcms")
    private EntityManager emcms;
	
	
	public SurveyResults addSurveyResult(SurveyResults result) {
		/*EntityTransaction etcms = emcms.getTransaction();
		etcms.begin();*/
		emcms.persist(result);
		emcms.flush();
		//etcms.commit();
		return result;
	}

}
