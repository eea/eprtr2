package eea.eprtr.Util;

import java.util.ArrayList;
import java.util.List;

import eea.eprtr.model.ActivityPollutantQuantity;
import eea.eprtr.model.LovPollutant;
import eea.eprtr.model.PollutantQuantity;
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
	
	public List<ActivityPollutantQuantity> getAreaOverview(List<Pollutanttransfer> elements, List<LovPollutant> pollist, Integer pollutantgroupid) throws CloneNotSupportedException {

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
		for(Pollutanttransfer obj: elements)
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
					activity = new ActivityPollutantQuantity(obj.getIAActivityCode(),obj.getLOV_IASectorID(),obj.getIASectorCode(),
							obj.getLOV_IAActivityID(),obj.getIAActivityCode(),null,null,pollutantgroupid,cloneList(pqlist),new ArrayList<ActivityPollutantQuantity>());
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
					//continue;
				}			
				setPollutantQuantity(activity, obj);
				//continue;
			}			
			setPollutantQuantity(sector, obj);
			//continue;
		}

		return list;

	}

	private void setPollutantQuantity(ActivityPollutantQuantity apq, Pollutanttransfer polrel){
		for(PollutantQuantity pq: apq.pollutantquantitys){
			if(pq.getLov_pollutantid().equals(polrel.getLOV_PollutantID())){
				pq.AddOneFacility();
				pq.appendToQuantity(polrel.getQuantity());
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
	
	private static List<PollutantQuantity> cloneList(List<PollutantQuantity> list) throws CloneNotSupportedException {
		List<PollutantQuantity> clone = new ArrayList<PollutantQuantity>(list.size());
	    for(PollutantQuantity item: list) clone.add((PollutantQuantity) item.clone());
	    return clone;
	}

}
