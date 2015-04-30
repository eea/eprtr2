package eea.eprtr.model;

public class PollutantConfidentiality  implements Comparable<PollutantConfidentiality> {

	private final Integer reportingYear;
	private final Double quantityPollutant;
	private final Double quantityConfidential;
	
    public PollutantConfidentiality(Integer reportingYear, Double quantityPollutant, Double quantityConfidential)
    {
        this.reportingYear = reportingYear;
        this.quantityPollutant = quantityPollutant;
        this.quantityConfidential = quantityConfidential;
    }

	public Integer getReportingYear() {
		return reportingYear;
	}

	public Double getQuantityPollutant() {
		return quantityPollutant;
	}

	public Double getQuantityConfidential() {
		return quantityConfidential;
	}

	   //Something like this already exists in your class
    @Override
    public boolean equals(Object o)
    {
        if(o != null && (o instanceof PollutantConfidentiality)) {
            return ((PollutantConfidentiality)o).getReportingYear().equals(reportingYear) &&
                   ((PollutantConfidentiality)o).getQuantityPollutant().equals(quantityPollutant)&&
                   ((PollutantConfidentiality)o).getQuantityConfidential().equals(quantityConfidential);
        }
        return false;
    }

    //This is required for HashSet
    //Note that if you override equals, you should override this
    //as well. See: http://stackoverflow.com/questions/27581/overriding-equals-and-hashcode-in-java
    @Override 
    public int hashCode()
    {
        return ((Integer)reportingYear).hashCode() + ((Double)quantityPollutant).hashCode() + ((Double)quantityConfidential).hashCode();
    }

    //This is required for TreeSet
    @Override
    public int compareTo(PollutantConfidentiality p)
    {
        if(reportingYear < p.getReportingYear()) return -1;
        else if(reportingYear > p.getReportingYear()) return 1;
        if(quantityPollutant < p.getQuantityPollutant()) return -1;
        else if(quantityPollutant > p.getQuantityPollutant()) return 1;
        if(quantityConfidential < p.getQuantityConfidential()) return -1;
        else if(quantityConfidential > p.getQuantityConfidential()) return 1;
        return 0;
    }

    @Override 
    public String toString()
    {
        return "PollutantConfidentiality: " + reportingYear + ", QuantityPollutant: " + quantityPollutant + ", QuantityConfidential: " + quantityConfidential;
    }
	
	
}
