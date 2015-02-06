package eea.eprtr.dao;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


public class OrderBy {

	private String order;
	private boolean desc;

	public OrderBy(String order, boolean desc) {
		this.order = order;
		this.desc = desc;
	}
	
	public void apply(CriteriaBuilder cb, CriteriaQuery<?> q, Root<?> qr) {
		if (desc) {
			q.orderBy(cb.desc(qr.get(order)));
		} else {
			q.orderBy(cb.asc(qr.get(order)));
		}
	}
}
