package eea.eprtr.Util;


import java.util.ArrayList;
import java.util.List;

import eea.eprtr.model.Pollutantrelease;

public class DataHelperPollutantRelease {

	private List<String> facilityPolluntant;
	public DataHelperPollutantRelease()
	{
	}
	
	public List<Pollutantrelease> getSubdata(String type,List<Pollutantrelease> elements)
	{
		facilityPolluntant = new ArrayList<String>();
		switch(type.toUpperCase())
		{
		case "POLLUTANTRELEASESUM":
			return getSummary(elements);
		default:
			return null;
		}
	}
	
	private Pollutantrelease findGroupe(List<Pollutantrelease> list, String key)
	{
		 for(Pollutantrelease obj : list){
			 if(obj.key.equals(key))
			 {
				 return obj;
			 }
		 }
		 return null;
	}
	
	private List<Pollutantrelease> getSummary(List<Pollutantrelease> elements)
	{
		List<Pollutantrelease> group = new ArrayList<Pollutantrelease>();
		for(Pollutantrelease obj : elements)
		{
			Pollutantrelease element = findGroupe(group, obj.getPollutantGroupCode());
			if(element == null)
			{
				element = new Pollutantrelease();
				element.key = obj.getPollutantGroupCode();
				element.sublevel = new ArrayList<Pollutantrelease>();
				group.add(element);
			}
			boolean exist = false;
			for(int j = 0;j< element.sublevel.size(); j++)
    		{	
    			if(element.sublevel.get(j).getLOV_PollutantID() ==  obj.getLOV_PollutantID())
    			{
    				boolean foundAccidental = false;
    				boolean foundData = false;
    				if(obj.getQuantityAccidentalAir() != null && obj.getQuantityAccidentalAir() > 0)
    				{
    					if(element.sublevel.get(j).getQuantityAccidentalAir() == null)
    					{
    						element.sublevel.get(j).setQuantityAccidentalAir(0.0);
    					}
    					element.sublevel.get(j).setQuantityAccidentalAir(element.sublevel.get(j).getQuantityAccidentalAir() +obj.getQuantityAccidentalAir());
    					foundAccidental = true;
    				}
    				if(obj.getQuantityAccidentalWater() != null && obj.getQuantityAccidentalWater() > 0)
    				{
    					if(element.sublevel.get(j).getQuantityAccidentalWater() == null)
    					{
    						element.sublevel.get(j).setQuantityAccidentalWater(0.0);
    					}
    					element.sublevel.get(j).setQuantityAccidentalWater(element.sublevel.get(j).getQuantityAccidentalWater() +obj.getQuantityAccidentalWater());
    					foundAccidental = true;
    				}
    				if(obj.getQuantityAccidentalSoil() != null && obj.getQuantityAccidentalSoil() > 0)
    				{		
    					if(element.sublevel.get(j).getQuantityAccidentalSoil() == null)
    					{
    						element.sublevel.get(j).setQuantityAccidentalSoil(0.0);
    					}
    					element.sublevel.get(j).setQuantityAccidentalSoil(element.sublevel.get(j).getQuantityAccidentalSoil() +obj.getQuantityAccidentalSoil());
    					foundAccidental = true;
    				}
    				
    				if(obj.getQuantityAir() != null && obj.getQuantityAir() > 0)
    				{
    					if(element.sublevel.get(j).getQuantityAir() == null)
    					{
    						element.sublevel.get(j).setQuantityAir(0.0);
    					}
    					foundData = true;
    					element.sublevel.get(j).setQuantityAir(element.sublevel.get(j).getQuantityAir() +obj.getQuantityAir());
    				}
    				if(obj.getQuantityWater() != null && obj.getQuantityWater() > 0)
    				{
    					if(element.sublevel.get(j).getQuantityWater() == null)
    					{
    						element.sublevel.get(j).setQuantityWater(0.0);
    					}
    					foundData = true;
    					element.sublevel.get(j).setQuantityWater(element.sublevel.get(j).getQuantityWater() +obj.getQuantityWater());
    				}
    				if(obj.getQuantitySoil() != null && obj.getQuantitySoil() > 0)
    				{		
    					if(element.sublevel.get(j).getQuantitySoil() == null)
    					{
    						element.sublevel.get(j).setQuantitySoil(0.0);
    					}
    					foundData = true;
    					element.sublevel.get(j).setQuantitySoil(element.sublevel.get(j).getQuantitySoil() +obj.getQuantitySoil());
    				}
    				if(foundAccidental)
    				{
    					element.sublevel.get(j).facilityAccidentalCount +=1;
    				}
    				if(foundData || foundAccidental)
    				{
    					if(!facilityPolluntant.contains(obj.getPollutantGroupCode()+"_"+obj.getFacilityID()))
						{
							facilityPolluntant.add(obj.getPollutantGroupCode()+"_"+obj.getFacilityID());
							element.sublevel.get(j).facilityTotalCount +=1;
						}
    					element.sublevel.get(j).facilityCount += 1;
    				}
    				exist = true;
    				break;
    			}
    		}
			
			if(!exist)
			{
				if(obj.getQuantityAccidentalAir() != null && obj.getQuantityAccidentalAir() > 0  || 
					obj.getQuantityAccidentalWater() != null && obj.getQuantityAccidentalWater() > 0  ||
					obj.getQuantityAccidentalSoil() != null && obj.getQuantityAccidentalSoil() > 0)
				{
					obj.facilityAccidentalCount = 1;
				}
				if(obj.getQuantityAir() != null && obj.getQuantityAir() > 0  || 
						obj.getQuantityWater() != null && obj.getQuantityWater() > 0  ||
						obj.getQuantitySoil() != null && obj.getQuantitySoil() > 0 ||
						obj.facilityAccidentalCount > 0)
					{
						obj.facilityCount = 1;
						if(!facilityPolluntant.contains(obj.getPollutantGroupCode()+"_"+obj.getFacilityID()))
						{
							facilityPolluntant.add(obj.getPollutantGroupCode()+"_"+obj.getFacilityID());
							obj.facilityTotalCount = 1;
						}
						
						element.sublevel.add(obj);
					}
			}	
		}
		return group;
	}
}
