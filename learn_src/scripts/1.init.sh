echo --------------------------------------------
echo
echo "cleaning up"
echo
echo --------------------------------------------
rm -rf ./neardev

echo --------------------------------------------
echo
echo "rebuilding the contract (release build)"
echo
echo --------------------------------------------
yarn build:release

file1="user1.txt"
if [ ! -f "$file1" ]
then
    echo --------------------------------------------
    echo
    echo "redeploying the contract"
    echo
    echo --------------------------------------------
    contract_file=$1
    echo "creating first dev-account"
    until echo "n" | near dev-deploy ./build/release/$contract_file; do :; done

    user1=$(cat ./neardev/dev-account)
    touch user1.txt
    echo $user1 > user1.txt
    echo "user1: $user1"
fi


