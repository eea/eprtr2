package eea.eprtr.dao;

import javax.persistence.TypedQuery;

public final class QueryPager {

    private final int offset;
    private final int maxResults;

    public QueryPager(int offset, int maxResults) {
        this.offset = offset;
        this.maxResults = maxResults;
    }

    public void apply(TypedQuery<?> query) {
        query.setMaxResults(getMaxResults());
        query.setFirstResult(getOffset());
    }

    public int getOffset() {
        return offset;
    }

    public int getMaxResults() {
        return maxResults;
    }
}
