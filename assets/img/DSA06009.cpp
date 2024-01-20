#include<bits/stdc++.h>
#include<map>
using namespace std;
bool cmp(int a, int b){
	return a<b;
}
int main(){
	int t;
	cin>>t;
	while(t--){
	int n,k;
	cin>>n>>k;
	int a[n];
	int dem=0;
	map<int,int> mp;
	vector<pair<int,int>> v;
	for(int i=0;i<n;i++) {
		cin>>a[i];
		mp[a[i]]++;
	}
	for(auto x:mp){
		v.push_back(x);
	}
	int r=v.size()-1;
	int l=0;
	if(l==r && v[l].first*2==k){
		dem+=v[l].second*(v[l].second-1)/2;
	}
	while(l<r){
		while(v[l].first + v[r].first > k) r--;
		while(v[l].first + v[r].first < k) l++;
		if(l==r){
			if(v[l].second==1) break;
				else{
					dem+=v[l].second*(v[l].second-1)/2;
					break;
				}
		}else if(l+1==r){
			dem+=v[l].second*v[r].second;
			break;
		} else{
			dem+=v[l].second*v[r].second;
			l++;r--;
		}

	}
	cout<<dem<<endl;
	}
}

