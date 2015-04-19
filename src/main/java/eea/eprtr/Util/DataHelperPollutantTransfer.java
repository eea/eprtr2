package eea.eprtr.Util;

import java.util.ArrayList;
import java.util.List;

import eea.eprtr.model.Pollutanttransfer;

public class DataHelperPollutantTransfer {

	private List<String> facilityPolluntant;
	public DataHelperPollutantTransfer()
	{		
	}
	
	public List<Pollutanttransfer> getSubdata(String type, List<Pollutanttransfer> elements)
	{
		facilityPolluntant = new ArrayList<String>();
		switch(type.toUpperCase())
		{
		case "POLLUTANTTRANSFERSUM":
			return getSummary(elements);
		default:
			return null;
		}
		
	}
	
	private Pollutanttransfer findGroupe(List<Pollutanttransfer> list, String key)
	{
		 for(Pollutanttransfer obj : list){
			 if(obj.key.equals(key))
			 {
				 return obj;
			 }
		 }
		 return null;
	}
	
	public List<Pollutanttransfer> getSummary(List<Pollutanttransfer> elements)
	{
		List<Pollutanttransfer> group = new ArrayList<Pollutanttransfer>();
		for(Pollutanttransfer obj : elements)
		{
			Pollutanttransfer element = findGroupe(group, obj.getPollutantGroupCode());
			if(element == null)
			{
				element = new Pollutanttransfer();
				element.key = obj.getPollutantGroupCode();
				element.sublevel = new ArrayList<Pollutanttransfer>();
				group.add(element);
			}
			
			boolean exist = false;
			for(int j = 0;j< element.sublevel.size(); j++)
    		{	
    			if(element.sublevel.get(j).getPollutantCode().equals(obj.getPollutantCode()))
    			{
    				if(obj.getQuantity() != null)
    				{
    					element.sublevel.get(j).totalQuantity += obj.getQuantity();
    				}

					if(!facilityPolluntant.contains(obj.getPollutantGroupCode()+"_"+obj.getFacilityID()))
					{
						facilityPolluntant.add(obj.getPollutantGroupCode()+"_"+obj.getFacilityID());
						element.sublevel.get(j).facilityTotalCount +=1;
					}
    				element.sublevel.get(j).facilityCount += 1;
    				exist = true;
    			}
    		}
			
			if(!exist)
			{
				if(!facilityPolluntant.contains(obj.getPollutantGroupCode()+"_"+obj.getFacilityID()))
				{
					facilityPolluntant.add(obj.getPollutantGroupCode()+"_"+obj.getFacilityID());
					obj.facilityTotalCount = 1;
				}
				obj.facilityCount = 1;
				obj.totalQuantity = obj.getQuantity();
    			element.sublevel.add(obj);
			}
			
		}
		return group;
	}
}
