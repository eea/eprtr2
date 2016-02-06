package eea.eprtrcms.dao;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import eea.eprtrcms.model.StringResource;
import eea.eprtrcms.model.StringResource_;

public class StringResourceFilter {

    private String resourceType;
    private String cultureCode;
    private String resourceKey;

    public StringResourceFilter(
            String resourceType,
            String cultureCode,
            String resourceKey) {
        this.resourceType = resourceType;
        this.cultureCode = cultureCode;
        this.resourceKey = resourceKey;
    }

    public Predicate buildWhereClause(CriteriaBuilder cb, Root<StringResource> qr) {
        Predicate whereClause = cb.conjunction();
        if (resourceType != null) {
            whereClause.getExpressions().add(cb.equal(qr.get(StringResource_.type), resourceType));
        }  
        if (cultureCode != null) {
            whereClause.getExpressions().add(cb.equal(qr.get(StringResource_.i18n), cultureCode));
        }
        if (resourceKey != null) {
            whereClause.getExpressions().add(cb.equal(qr.get(StringResource_.key), resourceKey));
        }
        return whereClause;
    }

}
