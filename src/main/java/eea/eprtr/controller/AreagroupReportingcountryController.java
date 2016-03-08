package eea.eprtr.controller;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.dao.AreaGroupReportingCountriesRepository;
import eea.eprtr.model.LocationList;

@RestController
public class AreagroupReportingcountryController {

    @PersistenceContext(unitName="eprtr")
    private EntityManager em;

    @Autowired
    private AreaGroupReportingCountriesRepository areaGroupReportingCountriesRepository;


    @RequestMapping("/areagroupReportingCountries")
    public List<LocationList> getAreagroupReportingCountries() {

        /*TypedQuery<AreagroupReportingcountry> query = em.createNamedQuery("AreagroupReportingcountry.findAll", AreagroupReportingcountry.class);
        return query.getResultList().toArray(new AreagroupReportingcountry[0]);
        */
        List<LocationList> results = areaGroupReportingCountriesRepository.getAreaGroupReportingCountries();
        return results;

    }
}
