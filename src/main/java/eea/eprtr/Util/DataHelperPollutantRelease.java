package eea.eprtr.Util;


import java.util.ArrayList;
import java.util.List;

import eea.eprtr.model.ActivityPollutantQuantity;
import eea.eprtr.model.LovPollutant;
import eea.eprtr.model.PollutantQuantity;
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
/*		case "AREAOVERVIEW":
			return getAreaOverview(elements);*/
		default:
			return null;
		}
	}
	
	public List<ActivityPollutantQuantity> getAreaOverview(List<Pollutantrelease> elements, List<LovPollutant> pollist, Integer pollutantgroupid) throws CloneNotSupportedException {

		//These are the lists we end up using
		List<ActivityPollutantQuantity> list = new ArrayList<ActivityPollutantQuantity>();
		
		/**
		 * Create Empty Pollutant Quantity list
		 */
		// Build empty List<PollutantQuantity>
		List<PollutantQuantity> pqlist = new ArrayList<PollutantQuantity>();
		for(LovPollutant pol : pollist){
			pqlist.add(new PollutantQuantity(pol.getLOV_PollutantID(),pol.getCode(), (long) 0, 0.0, 0.0, 0.0, 0.0));
		}
		
		//apqlist.add(new ActivityPollutantQuantity(iasectorid, iaactivityid, iasubactivityid, pollutantgroupid, pqlist, null))
		//For each sector 
		//  clone pollutant Quantity list
		/**
		 * Now we iterate the Pollutantrelease list
		 * to build tree
		 */
		for(Pollutantrelease obj: elements)
		{
			ActivityPollutantQuantity sector  = findAPQSector(list, obj.getLOV_IASectorID());
			if(sector == null)
			{
				sector = new ActivityPollutantQuantity(obj.getIASectorCode(),obj.getLOV_IASectorID(),obj.getIASectorCode(),
						null,null,null,null,pollutantgroupid,cloneList(pqlist),new ArrayList<ActivityPollutantQuantity>());
				list.add(sector);
			}

			if(obj.getLOV_IAActivityID() != null) 
			{
				ActivityPollutantQuantity activity  = findAPQActivity(sector.data, obj.getLOV_IAActivityID());
				if(activity == null)
				{
					activity = new ActivityPollutantQuantity(obj.getIAActivityCode(),obj.getLOV_IASectorID(),
							obj.getIASectorCode(),obj.getLOV_IAActivityID(),obj.getIAActivityCode(),null,null,
							pollutantgroupid,cloneList(pqlist),new ArrayList<ActivityPollutantQuantity>());
					sector.data.add(activity);
				}

				if(obj.getLOV_IASubActivityID() != null) 
				{
					ActivityPollutantQuantity subactivity  = findAPQSubActivity(activity.data, obj.getLOV_IASubActivityID());
					if(subactivity == null)
					{
						subactivity = new ActivityPollutantQuantity(obj.getIASubActivityCode(),obj.getLOV_IASectorID(),
								obj.getIASectorCode(),obj.getLOV_IAActivityID(),obj.getIAActivityCode(),obj.getLOV_IASubActivityID(),
								obj.getIASubActivityCode(),pollutantgroupid,cloneList(pqlist),new ArrayList<ActivityPollutantQuantity>());
						activity.data.add(subactivity);
					}
					//We add data
					setPollutantQuantity(subactivity, obj);
//					continue;
				}			
				setPollutantQuantity(activity, obj);
	//			continue;
			}			
			setPollutantQuantity(sector, obj);
		//	continue;
		}

		return list;

	}

	private void setPollutantQuantity(ActivityPollutantQuantity apq, Pollutantrelease polrel){
		for(PollutantQuantity pq: apq.pollutantquantitys){
			if(pq.getLov_pollutantid().equals(polrel.getLOV_PollutantID())){
				pq.AddOneFacility();
				pq.appendToQuantityAir(polrel.getQuantityAir());
				pq.appendToQuantityWater(polrel.getQuantityWater());
				pq.appendToQuantitySoil(polrel.getQuantitySoil());
				break;
			}
		}
	}
	
	private ActivityPollutantQuantity findAPQSector(List<ActivityPollutantQuantity> list, Integer key)
	{
		 for(ActivityPollutantQuantity obj : list){
			 if(obj.getIaSectorID().equals(key))
			 {
				 return obj;
			 }
		 }
		 return null;
	}
	private ActivityPollutantQuantity findAPQActivity(List<ActivityPollutantQuantity> list, Integer key)
	{
		 for(ActivityPollutantQuantity obj : list){
			 if(obj.getIaActivityID().equals(key))
			 {
				 return obj;
			 }
		 }
		 return null;
	}
	private ActivityPollutantQuantity findAPQSubActivity(List<ActivityPollutantQuantity> list, Integer key)
	{
		 for(ActivityPollutantQuantity obj : list){
			 if(obj.getIaSubActivityID().equals(key))
			 {
				 return obj;
			 }
		 }
		 return null;
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

	private static List<PollutantQuantity> cloneList(List<PollutantQuantity> list) throws CloneNotSupportedException {
		List<PollutantQuantity> clone = new ArrayList<PollutantQuantity>(list.size());
	    for(PollutantQuantity item: list) clone.add((PollutantQuantity) item.clone());
	    return clone;
	}

}
