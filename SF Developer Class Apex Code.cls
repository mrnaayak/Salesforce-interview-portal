                                                         DEVELOPER 

                                                   APEX VARIABLES_DAY-01

string coursename = 'salesforce';
system.debug('coursename' + coursename);

integer studentcount = 11119998;
system.debug('studentcount==' + studentcount);

long studentcount = 1111111111111111111L;
system.debug('studentcount ==' + studentcount);

long studentcount = 12345678912345674L;
system.debug('studentcount ==' + studentcount);

Decimal studentcount = 11111.6789;
system.debug('studentcount ==' + studentcount);


                                                    CLASSES & METHODS_DAY-02

public class ATM_HANDLER {

// variables
 string accountHolder='Munni';
    Integer banknumber=685471258;
    integer currentbalance=0;
    integer afterdeposit=100;
    integer overallmoney;
    
    // methods behaviour
    public void depositmoney(integer deposit){
    afterdeposit = currentbalance + deposit;
    overallmoney = afterdeposit;
    system.debug('currentbalance ==' + currentbalance);
    system.debug('depositmoney ==' + afterdeposit)
        system.debug('overall Money ==' + overallmoney);
    }
    public void withdrawmoney(integer withdraw){
        system.debug(' overall money before withdrawl == ' + overallmoney);
        overallmoney=overallmoney - withdraw;
        system.debug('overall money after withdrawl == ' + overallmoney);
    } 
}



                                             DEBUG: CLASSES & METHODS_DAY-02
 
ATM_HANDLER atm = new ATM_HANDLER();
atm.depositmoney(100);
atm.withdrawmoney(50);





                                          SUBJECT & PRIMITIVE DATATYPES_ DAY-03
    


Account asdf = new Account(); // object initiation
asdf.Name = 'Apex record 2 update without record id';
asdf.phone = '6305689456';
asdf.Annualrevenue = 100;
//acc.email = 'apex@gmail.com';
asdf.fax = 'apex core fax';
asdf.Rating = 'Hot';
asdf.id = '001gL00000ZaOqrQAF'; //Record URL Id
//insert asdf; //save new record
//update asdf; //update record
//delete asdf; //delete record
//upsert asdf; // record id is available (it will updated)
            // if record id not available create new record



                                             SUBJECT & NON_PRIMITIVE DATATYPES_ DAY-04
                                             
                                             
Map<String,Integer> mapdata = new Map<String, Integer>();
mapdata.put('Salesforce', 500);
mapdata.put('Java', 250);
System.debug('Projects' +mapdata);
System.debug('only project names (keys)' +mapdata.keyset()); 
System.debug('Only project num, (values)' +mapdata.values());
System.debug('Map contains salesforce' +mapdata.Containskey('SFDC'));
System.debug('get salesforce value' +mapdata.get('Java'));


                                            NON_PRIMITIVE DATATYPES & FOR_LOOPS DAY-05


for(initialization, check condition, increment or decrement){
    
}
//salesvorce 100 times
for(integer 1=2; i<=10; i+=2){
    //if(i%2==0){
     system.debug(i);
        //}
        }
        // works for one value
        Account accList=[SELECT id, Name from Account limit 1];
        system.debug('List of records Size'+ accList.Name);
        //more values
        List<Contact> accList=[SELECT id,Name,phone from contact where nulls last];
        system.debug('List of records size'+ accList.Size());
        for(Contact acc: accList){
            if(acc.Phone !=null){
                system.debug('if block records     --'+ acc.Name  +' -- ' + acc.phone);
                }else if(acc.Phone==null){
                    system.debug('Else block records  --'+ acc.Name  +' -- ' + acc.phone);
                }
            }
        }
    }
}



                                                SOQL & SOSL_DAY-06 & 07
                                                           
                                                           
CLASS NOTES: SOQL- Salesforce object query language
SOSL- Salesforce object search language
select{List of fields} From SObeject(salesforce object)
-> Open developer console--> Click on "Query Editor"--> And enter--> Select id,name,phone, rating From account 

Q: How many case status are working?(Only one filter condition)
A: "Where" We will use this to put the filters
Eg: Select id,Status From case where status='Working'--> click on Run Export---- The records will come, So this is how we can put the filtering

Q: How to know new and working case status are working?(picklist filter condition)
A: We can use "or" condition
Eg: Select id,Status From case where status ='Working' or status='New'

Q: We want all cases except closed cases?(Multiple filter conditions)
A: We can use "!="(Not quals to) 
Eg:Select id,Status From case where ststus !='Closed'

{Q: How to know only 4 or 5 case status are working?
A: We can use "and" condition

Q: We have total 50 or more than 50 cases, but we want only 5 cases then how to get that 5 cases?
A: We can use "IN"
Eg:Select id,Status From case where status IN('Re-opened','New','Escalated')}

**Q: I want to fetch account with no contacts?
A: We can use "NOT"
Eg: Select id,name from account where id NOT in (SELECT Accountid from contact)

**Q: The requirement is, the account mandatory have records? ---or---
**Q: I want to fetch account related contacts or account with contacts?
A: We can use "IN"
Eg: Select id,name from account where id IN (SELECT Accountid from contact)

Q: I want the Opportunity records where opportunity amount is more than 10000?
A: We can use ">" (Greater than)
Eg1: Select id,name,Amount,Approval_Status__c,from Opportunity where amount>10000

Q: I want the Opportunity records where opportunity amount is more than 20000?
A: We can use ">" (Greater than)
Eg2: Select id,name,Amount,Approval_Status__c,from Opportunity where amount>20000

**Q: How to know highest value,lowest value & I want to put this in the order?
A: We can use Ascending,Descending Order & For Order--We can use "ORDER BY" 
   Ascending(Asc)  ---- Small to Big (Lowest to Highest)
   Descending(Desc) ---- Big to Small(Highest to Lowest)
Eg1: Select id,name,Amount,Approval_Status__c from Opportunity where amount>20000 ORDER BY Amount Asc
Eg2: Select id,name,Amount,Approval_Status__c from Opportunity where amount>20000 ORDER BY Amount Desc

Q: How to know second highest value?
A:OFFSet 1
Eg1: Select id,name,Amount,Approval_Status__c from Opportunity where amount>20000 ORDER BY Amount Desc OFFset 1
Q:How to know 3rd highest value?
A:OFFSet 2
Eg2: Select id,name,Amount,Approval_Status__c from Opportunity where amount>20000 ORDER BY Amount Desc OFFset 2
--We can also use limit--but before OFFset 2
Eg3: Select id,name,Amount,Approval_Status__c from Opportunity where amount>20000 ORDER BY Amount Desc limit 25 OFFset 2

Q: We don't want to show the other amount details,To show only one Highest value amount details
A: Select id,name,Amount,Approval_Status__c from Opportunity where amount>20000 ORDER BY Amount DESC limit 1







Q: How to choose Multi select picklist?
A:Include
  Exclude


                                                        Apex_Triggers_DAY-08
                                                        
                                                        
Q: What is trigger?
A: Trigger is a piece of code to platform the automation 
Q: Types of trigger?
A: Triggers are 2 types(Before Trigger,After Trigger) 
1) Before Tigger: Before data commiting into database
  (Validation, id not available, fast field (within object)
2) After Trigger: Id is available here
                  i can update, delete,create undelete the related record
                  record is read only (object instantiation)
                  

Go to Developer console 
Click on file-->New-->
Apex Trigger-->Name: updateCountryCode
               sObject:Account--> submit
       
       
       
Prgrm:
trigger updateCountryCode on Account (before insert, before update, before delete){
    
    if(trigger.isbefore && Trigger.isinsert){
    //Trigger.new will return the list of record -->Account
    for(Account acc : trigger.new){
        System.debug('acc stands for duplication'+ acc);
        if(acc.BillingCountry=='India'){
            System.debug('acc country '+acc.BillingCountry);
            acc.phone='91 9515693242';
            }
        }
    }
    if(trigger.isbefore && Trigger.isupdate){ 
    //this code will work both insert and update
        for(Account acc : trigger.old)
        if(acc.Industry=='Banking'){
            acc.Type='other';
            
        }
    }
}

                                                  RECORD_TRIGGER_FLOW_DAY-09



                                                 PARENT_TO_CHILD_TRIGGER_DAY-09
                                                 
                                            
trigger updateCountryCode on Account(after update){
    // id accidVar; // variable   -- one vlaue
    //string phonevar; // one value
    //Set<Id> accids= new set<Id>(); // we can store more than one
    //List<String> phoneList = new List<String>();
    map<Id,Account> accountmap = new Map<Id,Acount>(); // key, value - accrecord
    //Trigger.new/old/oldmap/newmap
    for (Account acc : trigger.new){
        system.debug('new values of record' + acc.phone);
        if(acc.phone !=null){
         accountMap.put(acc.Id,acc);
         //accids.add(acc.Id);  ??accidVar =acc.id;  // storing record id in variable to fetch contacts
         // phoneList.aa(acc.phone);
    }
}                                   
// write soql query to fetch the related record
// account -- contact (Relationship field) - bakend store (id format)
List<contact> conList=[SELECT id, AccountId from contact where AccountId IN: accountMap.keyset()];
system.debug('all contacts'+ conList);
for (contact con : conList){ // each record will create
contact con1 =new Contact(); // after record read only
 con1.phone = accountMap.get (con.AccuntId);  // phoneList[0];  //[77777 , 88888 , 88888888]
 con1.id = con.id;
 update con1; //dnl
                                            








                                                     RECORD_TRIGGER_FLOW_DAY-09

 









